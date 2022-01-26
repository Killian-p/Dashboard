from django.contrib.sessions.backends.base import SessionBase
from django.test import TestCase

from .exceptions import ControllerException
from .controller import Controller
from .models import AuthenticatedDashboardUser, DashboardUser
from .password import Password
from .token import Token


class AccountTests(TestCase):
    def setUp(self) -> None:
        super().setUp()
        DashboardUser.objects.create(username="Test", email="test@epitech.eu", password=Password.encrypt("test"))

    def test_register_new_account(self) -> None:
        response = Controller.register_account({"username": "Me", "password": "Me", "email": "me@gmail.com"})
        self.assertIn("access_token", response)
        token: str = response["access_token"]
        body = Token.parse(token)
        me = DashboardUser.objects.get(username="Me")
        self.assertIn("user_id", body)
        self.assertEqual(body["user_id"], me.id)

    def test_register_account_already_exists(self) -> None:
        with self.assertRaises(ControllerException) as context:
            Controller.register_account({"username": "Another", "email": "test@epitech.eu", "password": "test"})
        self.assertEqual(context.exception.status_code, 409)

    def test_login_to_account(self) -> None:
        response = Controller.login_to_account({"email": "test@epitech.eu", "password": "test"})
        self.assertIn("access_token", response)
        token: str = response["access_token"]
        body = Token.parse(token)
        test = DashboardUser.objects.get(username="Test")
        self.assertIn("user_id", body)
        self.assertEqual(body["user_id"], test.id)

    def test_login_unknown_account(self) -> None:
        with self.assertRaises(ControllerException) as context:
            Controller.login_to_account({"email": "unknown@epitech.eu", "password": "test"})
        self.assertEqual(context.exception.status_code, 401)

    def test_login_wrong_password(self) -> None:
        with self.assertRaises(ControllerException) as context:
            Controller.login_to_account({"email": "test@epitech.eu", "password": "wrong"})
        self.assertEqual(context.exception.status_code, 401)


class ServicesTests(TestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = AuthenticatedDashboardUser.objects.create(username="Test", email="test@epitech.eu", password=Password.encrypt("test"))
        self.user.session = SessionBase()

    def test_get_services(self) -> None:
        response = Controller.get_user_services(self.user)
        self.assertListEqual(response["services"], [])
        self.user.services.create(name="spotify")
        self.user.services.create(name="github")
        response = Controller.get_user_services(self.user)
        self.assertEqual(len(response["services"]), 0)
        self.user.services.create(name="connection_less")
        response = Controller.get_user_services(self.user)
        self.assertEqual(len(response["services"]), 1)
        self.assertIn({"name": "connection_less"}, response["services"])

    def test_add_new_service(self) -> None:
        self.assertEqual(self.user.services.first(), None)
        response = Controller.add_new_service(self.user, {"name": "connection_less"})
        self.assertDictEqual(response, {"result": "success"})
        service = self.user.services.get(name="connection_less")
        self.assertEqual(service.name, "connection_less")

    def test_add_new_service_error_unknown(self) -> None:
        with self.assertRaises(ControllerException) as context:
            Controller.add_new_service(self.user, {"name": "unknown"})
        self.assertEqual(context.exception.status_code, 422)

    def test_remove_service(self) -> None:
        self.user.services.create(name="spotify")
        response = Controller.remove_service(self.user, "spotify")
        self.assertDictEqual(response, {"result": "success"})
        self.assertEqual(len(self.user.services.all()), 1)
        self.assertFalse(self.user.services.first().is_enabled(self.user.session))

    def test_remove_service_error_unknown(self) -> None:
        self.user.services.create(name="spotify")
        with self.assertRaises(ControllerException) as context:
            Controller.remove_service(self.user, "unknown")
        self.assertEqual(context.exception.status_code, 404)

    def test_remove_service_error_not_set(self) -> None:
        with self.assertRaises(ControllerException) as context:
            Controller.remove_service(self.user, "spotify")
        self.assertEqual(context.exception.status_code, 404)


class WidgetsTests(TestCase):
    def setUp(self) -> None:
        super().setUp()
        self.user = DashboardUser.objects.create(username="Test", email="test@epitech.eu", password=Password.encrypt("test"))

    def test_get_user_widgets(self) -> None:
        service = self.user.services.create(name="connection_less")
        service.widgets.create(type="weather", params={"city": "Bordeaux"})
        user_widgets = self.user.widgets
        assert len(user_widgets) == 1

    def test_get_user_widgets_no_services(self) -> None:
        user_widgets = self.user.widgets
        assert len(user_widgets) == 0

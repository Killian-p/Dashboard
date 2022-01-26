import { CButton } from '@coreui/react';
import { enableService } from '../../../api/service';
import { useToken } from '../../../hooks/useToken';

const LoginConnectionLess = ({getWidgets, updateConnection}: {getWidgets: () => void, updateConnection: () => void}) => {
  const token = useToken();

  const activateConnectionLess = () =>
    enableService('connection_less', token.get())
      .then(() => {
        updateConnection();
        getWidgets();
      })
      .catch(console.error);

  return (
    <div>
      <CButton onClick={activateConnectionLess}>Activate connectionless widgets</CButton>
    </div>
  );
}

export default LoginConnectionLess;
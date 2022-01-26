import React, { useState } from 'react';
import { CModal, CModalHeader, CModalTitle, CFormSelect, CButton } from '@coreui/react';
import { useToken } from '../../../hooks/useToken';
import { enableWidget } from '../../../api/widget';

const departementsList: {label: string, value: string}[] = [
  { "label": "Ain", "value": "ain" },
  { "label": "Aisne", "value": "aisne" },
  { "label": "Allier", "value": "allier" },
  { "label": "Alpes-de-Haute-Provence", "value": "alpes-de-haute-provence" },
  { "label": "Hautes-Alpes", "value": "hautes-alpes" },
  { "label": "Alpes-Maritimes", "value": "alpes-maritimes" },
  { "label": "Ardèche", "value": "ardeche" },
  { "label": "Ardennes", "value": "ardennes" },
  { "label": "Ariège", "value": "ariege" },
  { "label": "Aube", "value": "aube" },
  { "label": "Aude", "value": "aude" },
  { "label": "Aveyron", "value": "aveyron" },
  { "label": "Bouches-du-Rhône", "value": "bouches-du-rhone" },
  { "label": "Calvados", "value": "calvados" },
  { "label": "Cantal", "value": "cantal" },
  { "label": "Charente", "value": "charente" },
  { "label": "Charente-Maritime", "value": "charente-maritime" },
  { "label": "Cher", "value": "cher" },
  { "label": "Corrèze", "value": "correze" },
  { "label": "Corse-du-Sud", "value": "corse-du-sud" },
  { "label": "Haute-Corse", "value": "haute-corse" },
  { "label": "Côte-d'Or", "value": "cote-d'or" },
  { "label": "Côtes d'Armor", "value": "cotes-d'armor" },
  { "label": "Creuse", "value": "creuse" },
  { "label": "Dordogne", "value": "dordogne" },
  { "label": "Doubs", "value": "doubs" },
  { "label": "Drôme", "value": "drome" },
  { "label": "Eure", "value": "eure" },
  { "label": "Eure-et-Loir", "value": "eure-et-loir" },
  { "label": "Finistère", "value": "finistere" },
  { "label": "Gard", "value": "gard" },
  { "label": "Haute-Garonne", "value": "haute-garonne" },
  { "label": "Gers", "value": "gers" },
  { "label": "Gironde", "value": "gironde" },
  { "label": "Hérault", "value": "herault" },
  { "label": "Ille-et-Vilaine", "value": "ille-et-vilaine" },
  { "label": "Indre", "value": "indre" },
  { "label": "Indre-et-Loire", "value": "indre-et-loire" },
  { "label": "Isère", "value": "isere" },
  { "label": "Jura", "value": "jura" },
  { "label": "Landes", "value": "landes" },
  { "label": "Loir-et-Cher", "value": "loir-et-cher" },
  { "label": "Loire", "value": "loire" },
  { "label": "Haute-Loire", "value": "haute-loire" },
  { "label": "Loire-Atlantique", "value": "loire-atlantique" },
  { "label": "Loiret", "value": "loiret" },
  { "label": "Lot", "value": "lot" },
  { "label": "Lot-et-Garonne", "value": "lot-et-garonne" },
  { "label": "Lozère", "value": "lozere" },
  { "label": "Maine-et-Loire", "value": "maine-et-loire" },
  { "label": "Manche", "value": "manche" },
  { "label": "Marne", "value": "marne" },
  { "label": "Haute-Marne", "value": "haute-marne" },
  { "label": "Mayenne", "value": "mayenne" },
  { "label": "Meurthe-et-Moselle", "value": "meurthe-et-moselle" },
  { "label": "Meuse", "value": "meuse" },
  { "label": "Morbihan", "value": "morbihan" },
  { "label": "Moselle", "value": "moselle" },
  { "label": "Nièvre", "value": "nievre" },
  { "label": "Nord", "value": "nord" },
  { "label": "Oise", "value": "oise" },
  { "label": "Orne", "value": "orne" },
  { "label": "Pas-de-Calais", "value": "pas-de-calais" },
  { "label": "Puy-de-Dôme", "value": "puy-de-dome" },
  { "label": "Pyrénées-Atlantiques", "value": "pyrenees-atlantiques" },
  { "label": "Hautes-Pyrénées", "value": "hautes-pyrenees" },
  { "label": "Pyrénées-Orientales", "value": "pyrenees-orientales" },
  { "label": "Bas-Rhin", "value": "bas-rhin" },
  { "label": "Haut-Rhin", "value": "haut-rhin" },
  { "label": "Rhône", "value": "rhone" },
  { "label": "Haute-Saône", "value": "haute-saone" },
  { "label": "Saône-et-Loire", "value": "saone-et-loire" },
  { "label": "Sarthe", "value": "sarthe" },
  { "label": "Savoie", "value": "savoie" },
  { "label": "Haute-Savoie", "value": "haute-savoie" },
  { "label": "Paris", "value": "paris" },
  { "label": "Seine-Maritime", "value": "seine-maritime" },
  { "label": "Seine-et-Marne", "value": "seine-et-marne" },
  { "label": "Yvelines", "value": "yvelines" },
  { "label": "Deux-Sèvres", "value": "deux-sevres" },
  { "label": "Somme", "value": "somme" },
  { "label": "Tarn", "value": "tarn" },
  { "label": "Tarn-et-Garonne", "value": "tarn-et-garonne" },
  { "label": "Var", "value": "var" },
  { "label": "Vaucluse", "value": "vaucluse" },
  { "label": "Vendée", "value": "vendee" },
  { "label": "Vienne", "value": "vienne" },
  { "label": "Haute-Vienne", "value": "haute-vienne" },
  { "label": "Vosges", "value": "vosges" },
  { "label": "Yonne", "value": "yonne" },
  { "label": "Essonne", "value": "essonne" },
  { "label": "Hauts-de-Seine", "value": "hauts-de-seine" },
  { "label": "Seine-Saint-Denis", "value": "seine-saint-denis" },
  { "label": "Val-de-Marne", "value": "val-de-marne" },
  { "label": "Val-D'Oise", "value": "val-d'oise" },
  { "label": "Guadeloupe", "value": "guadeloupe" },
  { "label": "Martinique", "value": "martinique" },
  { "label": "Guyane", "value": "guyane" },
  { "label": "La Réunion", "value": "reunion" },
  { "label": "Mayotte", "value": "mayotte" }
]

const CoronavirusWidgetModal = ({ getWidgets, modalIsVisible, setModalVisible }: { getWidgets: () => void, modalIsVisible: boolean, setModalVisible: (value: boolean) => void }) => {
  const [selectedValue, setSelectedValue] = useState<string>("ain");
  const token = useToken();

  const addCoronavirusWidget = () => {
    enableWidget('connection_less', 'coronavirus', token.get(), { departement: selectedValue })
      .then(() => getWidgets())
      .catch(console.error)
      .finally(() => setModalVisible(false))
  }

  return (
    <CModal scrollable alignment="center" visible={modalIsVisible} onClose={() => setModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>Widget Information</CModalTitle>
      </CModalHeader>
      <div className="mb-3 m-7">
        <p className="mb-2">Select a departement:</p>
        <CFormSelect options={departementsList} value={selectedValue} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setSelectedValue(event.target.value)} />
        <div className="flex justify-center mt-4">
          <CButton color="primary" onClick={addCoronavirusWidget}>
            Add
          </CButton>
        </div>
      </div>
    </CModal>
  );
}

export default CoronavirusWidgetModal;
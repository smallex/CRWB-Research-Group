import {getLanguageCode, VocabEnum} from "./Constants";
import LocalizedStrings from 'react-native-localization';
import moment from "moment";
import "moment/locale/ja";
import "moment/locale/fr";
import strings from '../strings';

moment.locale(getLanguageCode());

export const allVocabulary = [
    {key: '0', type: VocabEnum.TASTE, value: strings.basil},
    {key: '1', type: VocabEnum.TASTE, value: strings.bitter},
    {key: '2', type: VocabEnum.TASTE, value: strings.bitterSweet},
    {key: '3', type: VocabEnum.TASTE, value: strings.burnt},
    {key: '4', type: VocabEnum.TASTE, value: strings.cinnamon},
    {key: '5', type: VocabEnum.TASTE, value: strings.coriander},
    {key: '6', type: VocabEnum.TASTE, value: strings.cumin},
    {key: '7', type: VocabEnum.TASTE, value: strings.dill},
    {key: '8', type: VocabEnum.TASTE, value: strings.fishy},
    {key: '9', type: VocabEnum.TASTE, value: strings.floral},
    {key: '10', type: VocabEnum.TASTE, value: strings.fresh},
    {key: '11', type: VocabEnum.TASTE, value: strings.fruity},
    {key: '12', type: VocabEnum.TASTE, value: strings.garlic},
    {key: '13', type: VocabEnum.TASTE, value: strings.gingery},
    {key: '14', type: VocabEnum.TASTE, value: strings.lemon},
    {key: '15', type: VocabEnum.TASTE, value: strings.nutmeg},
    {key: '16', type: VocabEnum.TASTE, value: strings.nutty},
    {key: '17', type: VocabEnum.TASTE, value: strings.oily},
    {key: '18', type: VocabEnum.TASTE, value: strings.oniony},
    {key: '19', type: VocabEnum.TASTE, value: strings.orange},
    {key: '20', type: VocabEnum.TASTE, value: strings.paprika},
    {key: '21', type: VocabEnum.TASTE, value: strings.parsley},
    {key: '22', type: VocabEnum.TASTE, value: strings.pepper},
    {key: '23', type: VocabEnum.TASTE, value: strings.rosemary},
    {key: '24', type: VocabEnum.TASTE, value: strings.salty},
    {key: '25', type: VocabEnum.TASTE, value: strings.sour},
    {key: '26', type: VocabEnum.TASTE, value: strings.spicy},
    {key: '27', type: VocabEnum.TASTE, value: strings.sweet},
    {key: '28', type: VocabEnum.TASTE, value: strings.umami},
    {key: '29', type: VocabEnum.TASTE, value: strings.vanilla},
];
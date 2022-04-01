import { FontStyle } from 'app/types/ChartConfig';

export type TextStyle = {
  cell: { backgroundColor: string; crossBackgroundColor?: string };
  text: { fill: string; textAlign: string } & FontStyle;
  bolderText?: { fill: string; textAlign: string } & FontStyle;
};

export type TableSorters = {
  sortFieldId: any;
  sortFunc: (params) => string[];
} | null;
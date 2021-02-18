import React from 'react';
import {
  Table as GrommetTable,
  TableHeader,
  TableBody,
  TableRow,
} from 'grommet';

export const Table = ({ headers, tableData }) => (
  <GrommetTable border="horizontal">
    <TableHeader>
      <TableRow>{headers}</TableRow>
    </TableHeader>
    <TableBody>
      <TableRow></TableRow>
      {tableData}
    </TableBody>
  </GrommetTable>
);

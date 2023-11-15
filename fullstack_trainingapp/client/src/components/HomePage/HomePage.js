import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';

// Updated VISIBLE_FIELDS to match the server's response keys
const VISIBLE_FIELDS = ['id', 'First Name', 'Last Name', 'Badge Number', 'Training Title', 'Trainer', 'Date'];

export default function QuickFilteringGrid() {
  const [data, setData] = React.useState({ rows: [], columns: [] });
  const [query, setQuery] = React.useState('');

  const fetchData = () => {
    console.log(`Fetching data for query: ${query}`);
    axios.get(`http://localhost:5000/search?query=${query}`)
      .then((response) => {
        const rows = response.data.map((row, index) => ({ id: index, ...row }));
        console.log(`Received data: ${JSON.stringify(rows)}`);
        if (!rows.length) {
          console.log('Received empty or unexpected data');
          return;
        }
        const columns = Object.keys(rows[0]).map((key) => ({
          field: key,
          headerName: key,  // Assuming the keys from the server are already in the format you want to display
          width: 150,
        }));
        setData({ rows, columns });
      });
  };

  React.useEffect(() => {
    fetchData();
  }, [query]);

  const columns = React.useMemo(
    () => data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns],
  );

  return (
    <Box sx={{ height: 400, width: 1 }}>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={fetchData}>Submit</button>
      <DataGrid
        rows={data.rows}
        columns={columns}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}

import { Card, Table, Tooltip, TableRow, TableBody, TableCell, TableHead, Typography } from '@mui/material';

export function AnalyticsSingleTable({ analyticsData }) {
  if (!analyticsData) return null;

  // Clear table rows
  const rows = [];

  const getRowTooltip = (metric) => {
    switch (metric) {
      case 'Starting MRR':
        return 'Total recurring revenue at the start of the selected period.';
      case 'New Customer MRR':
        return 'Recurring revenue added by customers who signed up this period (excludes upgrades).';
      case 'Upgrade MRR (Expansion)':
        return 'Additional revenue from customers moving to higher-priced plans.';
      case 'Downgrade MRR (Contraction)':
        return 'Revenue lost when customers move to lower-priced plans.';
      case 'Churned MRR':
        return 'Revenue lost from customers who fully cancelled during the period.';
      case 'Net New MRR':
        return 'New + Upgrade - Downgrade - Churned.';
      case 'Ending MRR':
        return 'Total recurring revenue at the end of the selected period.';
      default:
        return '';
    }
  };

  return (
    <Card sx={{ 
      p: 6, 
      mb: 3,
      borderRadius: '16px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      bgcolor: 'white'
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        mb: 4,
        fontSize: '1.125rem',
        color: 'grey.800'
      }}>
        MRR Movement Analysis
      </Typography>
      
      <Table sx={{ 
        tableLayout: 'fixed',
        width: '100%'
      }}>
        <colgroup>
          <col style={{ width: '60%' }} />
          <col style={{ width: '25%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
        
        <TableHead>
          <TableRow>
            <TableCell sx={{ 
              bgcolor: 'grey.50', 
              color: 'grey.600', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              border: 'none',
              py: 2,
              px: 3,
              verticalAlign: 'middle'
            }}>
              METRIC
            </TableCell>
            <TableCell sx={{ 
              bgcolor: 'grey.50', 
              color: 'grey.600', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              border: 'none',
              py: 2,
              px: 3,
              verticalAlign: 'middle',
              textAlign: 'right'
            }}>
              VALUE
            </TableCell>
            <TableCell sx={{ 
              bgcolor: 'grey.50', 
              color: 'grey.600', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              border: 'none',
              py: 2,
              px: 3,
              verticalAlign: 'middle',
              textAlign: 'right'
            }}>
              % OF START MRR
            </TableCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          {rows.map((row, index) => (
            <Tooltip key={index} title={getRowTooltip(row.metric)} placement="top" arrow>
              <TableRow sx={{ 
                '&:nth-of-type(odd)': { bgcolor: 'white' },
                '&:nth-of-type(even)': { bgcolor: 'grey.50' },
                '&:hover': { bgcolor: 'grey.100' },
                transition: 'background-color 0.2s',
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderColor: 'grey.100'
              }}>
                <TableCell sx={{ 
                  color: 'grey.700', 
                  fontSize: '0.875rem',
                  border: 'none',
                  py: 2,
                  px: 3,
                  verticalAlign: 'middle'
                }}>
                  {row.metric}
                </TableCell>
                <TableCell sx={{ 
                  color: 'grey.700', 
                  fontSize: '0.875rem',
                  border: 'none',
                  py: 2,
                  px: 3,
                  verticalAlign: 'middle',
                  textAlign: 'right'
                }}>
                  {row.value}
                </TableCell>
                <TableCell sx={{ 
                  color: 'grey.600', 
                  fontSize: '0.875rem',
                  border: 'none',
                  py: 2,
                  px: 3,
                  verticalAlign: 'middle',
                  textAlign: 'right'
                }}>
                  {row.percent}
                </TableCell>
              </TableRow>
            </Tooltip>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}



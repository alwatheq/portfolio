import { FixedSizeGrid as Grid } from 'react-window';
import { useMemo } from 'react';

export const VirtualizedProjectGrid = ({ projects, itemHeight = 300, columnsPerRow = 3 }) => {
  const gridData = useMemo(() => {
    const rows = Math.ceil(projects.length / columnsPerRow);
    return Array.from({ length: rows }, (_, rowIndex) =>
      projects.slice(rowIndex * columnsPerRow, (rowIndex + 1) * columnsPerRow)
    );
  }, [projects, columnsPerRow]);

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const project = gridData[rowIndex]?.[columnIndex];
    if (!project) return <div style={style} />;

    return (
      <div style={style} className="p-2">
        <ProjectCard project={project} />
      </div>
    );
  };

  return (
    <Grid
      height={600}
      width="100%"
      columnCount={columnsPerRow}
      columnWidth={400}
      rowCount={gridData.length}
      rowHeight={itemHeight}
      itemData={gridData}
    >
      {Cell}
    </Grid>
  );
};
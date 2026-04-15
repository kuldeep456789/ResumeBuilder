import React from 'react';
import StandardTemplate from './templates/StandardTemplate';

const Resume = React.forwardRef(({ data }, ref) => {
    return <StandardTemplate data={data} ref={ref} />;
});

export default Resume;

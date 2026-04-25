import React from 'react';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CorporateTemplate from './templates/CorporateTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import BusinessTemplate from './templates/BusinessTemplate';
import SimpleTemplate from './templates/SimpleTemplate';
import StandardTemplate from './templates/StandardTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';

// Map template IDs to their respective components
const TEMPLATE_COMPONENTS = {
    executive: ExecutiveTemplate,
    corporate: CorporateTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    business: BusinessTemplate,
    simple: SimpleTemplate,
    standard: StandardTemplate,
    technical: TechnicalTemplate
};

const Resume = React.forwardRef(({ data }, ref) => {
    // Get the selected template ID from settings, default to 'standard' if not found
    const templateId = data?.settings?.template || 'standard';
    
    // Select the appropriate component
    const TemplateComponent = TEMPLATE_COMPONENTS[templateId] || StandardTemplate;

    return <TemplateComponent data={data} ref={ref} />;
});

export default Resume;

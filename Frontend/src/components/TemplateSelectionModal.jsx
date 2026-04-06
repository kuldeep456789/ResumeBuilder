import React from 'react';
import './TemplateSelectionModal.css';

const TemplateSelectionModal = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="template-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="template-modal-header">
                    <h2>Choose Your Template</h2>
                    <p>Select a starting point for your new resume. You can always change this later.</p>
                    <button className="template-modal-close" onClick={onClose}>&times;</button>
                </div>

                <div className="template-options-grid">
                    <div className="template-option recommended" onClick={() => onSelect('standard')}>
                        <div className="popular-badge">RECOMMENDED</div>
                        <div className="template-thumbnail standard-thumb">
                            <div className="thumb-header"></div>
                            <div className="thumb-line"></div>
                            <div className="thumb-line short"></div>
                            <div className="thumb-section"></div>
                            <div className="thumb-line"></div>
                            <div className="thumb-line"></div>
                        </div>
                        <h3>Standard</h3>
                        <p>The industry gold standard for clean, professional presentation.</p>
                        <div className="select-hint">CHOOSE TEMPLATE</div>
                    </div>

                    <div className="template-option" onClick={() => onSelect('modern')}>
                        <div className="template-thumbnail modern-thumb">
                            <div className="thumb-header-solid"></div>
                            <div className="thumb-body-split">
                                <div className="thumb-section-border"></div>
                                <div className="thumb-line"></div>
                                <div className="thumb-line"></div>
                                <div className="thumb-section-border"></div>
                                <div className="thumb-line"></div>
                            </div>
                        </div>
                        <h3>Modern</h3>
                        <p>A contemporary layout with bold headers and clear dividers.</p>
                        <div className="select-hint">CHOOSE TEMPLATE</div>
                    </div>

                    <div className="template-option" onClick={() => onSelect('minimalist')}>
                        <div className="template-thumbnail minimalist-thumb">
                            <div className="thumb-header-center"></div>
                            <div className="thumb-line center"></div>
                            <div className="thumb-body">
                                <div className="thumb-line bold border-bottom"></div>
                                <div className="thumb-line"></div>
                                <div className="thumb-line"></div>
                            </div>
                        </div>
                        <h3>Minimalist</h3>
                        <p>Perfect for experienced pros who value clarity and precision.</p>
                        <div className="select-hint">CHOOSE TEMPLATE</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelectionModal;

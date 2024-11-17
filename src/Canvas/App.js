import { useEffect, useReducer, useRef, useState } from 'react';
import GraphicsDrawable from './BusinessObjects/GraphicsDrawable';
import './styles.css';

export default function AppCanvas() {
    const canvasRef = useRef(null);
    const [activeTab, setActiveTab] = useState('Description');
    const [state, dispatch] = useReducer(graphicsReducer, { drawable: new GraphicsDrawable(canvasRef) });

    useEffect(() => {
        state.drawable.draw();
    }, []);

    const openTab = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="container">
            <div className="tab">
                <button className={`tablinks ${activeTab === 'Description' ? 'active' : ''}`} onClick={() => openTab('Description')}>Description</button>
                <button className={`tablinks ${activeTab === 'Transformation' ? 'active' : ''}`} onClick={() => openTab('Transformation')}>Transformation</button>
                <button className={`tablinks ${activeTab === 'Projection' ? 'active' : ''}`} onClick={() => openTab('Projection')}>Projection</button>
                <button className={`tablinks ${activeTab === 'Light' ? 'active' : ''}`} onClick={() => openTab('Light')}>Light</button>
            </div>
            <div className="content">
                <div className="controls">
                    {activeTab === 'Description' && <DescriptionTab model={state.drawable.model} dispatch={dispatch} />}
                    {activeTab === 'Transformation' && <TransformationTab />}
                    {activeTab === 'Projection' && <ProjectionTab />}
                    {activeTab === 'Light' && <LightTab />}
                </div>
                <canvas ref={canvasRef} className="canvas" />
            </div>
        </div>
    );
};

const graphicsReducer = (state, action) => {
    state.drawable.model.setValue(action.fieldName, action.newValue);
    state.drawable.draw();
    return { ...state, drawable: state.drawable };
};

const DescriptionTab = ({ model, dispatch }) => {
    return (
        <>
            <div className="image-container" />
            <div className="stepper-container">
                <Stepper field='A' value={model.A} dispatch={dispatch} min={model.minA} max={12} />
                <Stepper field='B' value={model.B} dispatch={dispatch} min={model.minB} max={12} />
                <Stepper field='C' value={model.C} dispatch={dispatch} min={4} max={12} />
                <Stepper field='R' value={model.R} dispatch={dispatch} min={1} max={model.maxR} />
                <Stepper field='dX' value={model.dX} dispatch={dispatch} min={model.mindX} max={model.maxdX} />
                <Stepper field='dZ' value={model.dZ} dispatch={dispatch} min={model.mindZ} max={model.maxdZ} />
                <Stepper field='N' value={model.N} dispatch={dispatch} min={4} max={72} step={4} />
            </div>
        </>
    );
};

const Stepper = ({ field, value, dispatch, min, max, step = 1 }) => {
    const handleDecrement = () => {
        if (value - step >= min) {
            dispatch({ fieldName: field, newValue: value - step });
        }
    };

    const handleIncrement = () => {
        if (value + step <= max) {
            dispatch({ fieldName: field, newValue: value + step });
        }
    };

    return (
        <div className="stepper-item">
            <label>{field} = {value}</label>
            <div>
                <button onClick={handleDecrement}>-</button>
                <button onClick={handleIncrement}>+</button>
            </div>
        </div>
    );
};

const TransformationTab = () => (
    <button>2</button>
);

const ProjectionTab = () => (
    <button>3</button>
);

const LightTab = () => (
    <button>4</button>
);
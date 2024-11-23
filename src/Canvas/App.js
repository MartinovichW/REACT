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
                    {activeTab === 'Transformation' && <TransformationTab drawable={state.drawable} dispatch={dispatch} />}
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
    if (action.needDraw)
        state.drawable.draw();

    return { ...state, drawable: state.drawable };
};

const DescriptionTab = ({ model, dispatch }) => {
    return (
        <>
            <div className="image-container" />
            <table className="table">
                <tr>
                    <Stepper field='A' value={model.A} dispatch={dispatch} min={model.minA} max={12} />
                    <Stepper field='B' value={model.B} dispatch={dispatch} min={model.minB} max={12} />
                    <Stepper field='C' value={model.C} dispatch={dispatch} min={4} max={12} />
                    <Stepper field='R' value={model.R} dispatch={dispatch} min={1} max={model.maxR} />
                    <Stepper field='dX' value={model.dX} dispatch={dispatch} min={model.mindX} max={model.maxdX} />
                    <Stepper field='dZ' value={model.dZ} dispatch={dispatch} min={model.mindZ} max={model.maxdZ} />
                    <Stepper field='N' value={model.N} dispatch={dispatch} min={4} max={72} step={4} />
                </tr>
            </table>
        </>
    );
};

const Stepper = ({ field, value, dispatch, min, max, step = 1, needDraw = true,
                   handleExtraAction1, handleExtraAction2, extraActionClassName1, extraActionClassName2 }) => {
    const handleDecrement = () => {
        if (value - step >= min) {
            dispatch({ fieldName: field, newValue: value - step, needDraw: needDraw });
        }
    };

    const handleIncrement = () => {
        if (value + step <= max) {
            dispatch({ fieldName: field, newValue: value + step, needDraw: needDraw });
        }
    };

    return (
        <td className="td">
            <label>{field} = {value}</label>
            <div>
                <button onClick={handleDecrement}>-</button>
                <button onClick={handleIncrement}>+</button>
            </div>
            <div>
                {handleExtraAction1 && (<button className={extraActionClassName1} onClick={handleExtraAction1} />)}
                {handleExtraAction2 && (<button className={extraActionClassName2} onClick={handleExtraAction2} />)}
            </div>
        </td>
    );
};

const TransformationTab = ({ drawable, dispatch }) => {
    const handleExtraAction = (code) => {
        drawable.model.calculateTransformation(code);
        drawable.draw();
    };

    return (
        <>
            <table className="table">
                <tr className="tr">
                    <th colspan="3">Move</th>
                </tr>
                <tr>
                    <Stepper field='MX' value={drawable.model.MX} dispatch={dispatch} min={1} max={3} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("11")}
                        handleExtraAction2={() => handleExtraAction("12")}
                        extraActionClassName1="btn dxleft"
                        extraActionClassName2="btn dxright" />
                    <Stepper field='MY' value={drawable.model.MY} dispatch={dispatch} min={1} max={3} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("13")}
                        handleExtraAction2={() => handleExtraAction("14")}
                        extraActionClassName1="btn dybuttom"
                        extraActionClassName2="btn dytop" />
                    <Stepper field='MZ' value={drawable.model.MZ} dispatch={dispatch} min={1} max={3} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("15")}
                        handleExtraAction2={() => handleExtraAction("16")}
                        extraActionClassName1="btn dzleft"
                        extraActionClassName2="btn dzright" />
                </tr>
            </table>
            <div className="table-spacing" />
            <table className="table">
                <tr className="tr">
                    <th className="th" colspan="3">Scale</th>
                </tr>
                <tr>
                    <Stepper field='SX' value={drawable.model.SX} dispatch={dispatch} min={0.5} max={2.0} step={0.5} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("21")}
                        extraActionClassName1="btn sx" />
                    <Stepper field='SY' value={drawable.model.SY} dispatch={dispatch} min={0.5} max={2.0} step={0.5} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("22")}
                        extraActionClassName1="btn sy" />
                    <Stepper field='SZ' value={drawable.model.SZ} dispatch={dispatch} min={0.5} max={2.0} step={0.5} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("23")}
                        extraActionClassName1="btn sz" />
                </tr>
            </table>
            <div className="table-spacing" />
            <table className="table">
                <tr className="tr">
                    <th className="th" colspan="3">Rotate</th>
                </tr>
                <tr>
                    <Stepper field='AX' value={drawable.model.AX} dispatch={dispatch} min={5} max={180} step={5} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("31")}
                        handleExtraAction2={() => handleExtraAction("32")}
                        extraActionClassName1="btn axL"
                        extraActionClassName2="btn axR" />
                    <Stepper field='AY' value={drawable.model.AY} dispatch={dispatch} min={5} max={180} step={5} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("33")}
                        handleExtraAction2={() => handleExtraAction("34")}
                        extraActionClassName1="btn ayL"
                        extraActionClassName2="btn ayR" />
                    <Stepper field='AZ' value={drawable.model.AZ} dispatch={dispatch} min={5} max={180} step={5} needDraw={false}
                        handleExtraAction1={() => handleExtraAction("35")}
                        handleExtraAction2={() => handleExtraAction("36")}
                        extraActionClassName1="btn azL"
                        extraActionClassName2="btn azR" />
                </tr>
            </table>
        </>
    );
};

const ProjectionTab = () => (
    <button>3</button>
);

const LightTab = () => (
    <button>4</button>
);
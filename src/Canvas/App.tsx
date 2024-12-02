import { useEffect, useReducer, useRef, useState } from 'react';

import GraphicsDrawable from './BusinessObjects/GraphicsDrawable';
import DescriptionTab from './Tabs/Description';
import TransformationTab from './Tabs/Transformation';
import ProjectionTab from './Tabs/Projection';
import LightTab from './Tabs/Light';

import './Canvas.less';

export default function AppCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState<string>('Description');
    const [state, dispatch] = useReducer(graphicsReducer, { drawable: new GraphicsDrawable(canvasRef) });

    useEffect(() => {
        state.drawable.draw();
    }, [state.drawable]);

    const openTab = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div id="canvasPage">
            <div className="tabPanel">
                <button
                    className={`tablinks ${activeTab === 'Description' ? 'active' : ''}`}
                    onClick={() => openTab('Description')}>
                    Description
                </button>
                <button
                    className={`tablinks ${activeTab === 'Transformation' ? 'active' : ''}`}
                    onClick={() => openTab('Transformation')}>
                    Transformation
                </button>
                <button
                    className={`tablinks ${activeTab === 'Projection' ? 'active' : ''}`}
                    onClick={() => openTab('Projection')}>
                    Projection
                </button>
                <button
                    className={`tablinks ${activeTab === 'Light' ? 'active' : ''}`}
                    onClick={() => openTab('Light')}>
                    Light
                </button>
            </div>
            <div className="tabContent">
                <div className="tabControls">
                    {activeTab === 'Description' &&
                        <DescriptionTab model={state.drawable.model} dispatch={dispatch} />}
                    {activeTab === 'Transformation' &&
                        <TransformationTab drawable={state.drawable} dispatch={dispatch} />}
                    {activeTab === 'Projection' &&
                        <ProjectionTab drawable={state.drawable} dispatch={dispatch} />}
                    {activeTab === 'Light' &&
                        <LightTab drawable={state.drawable} dispatch={dispatch} />}
                </div>
                <canvas ref={canvasRef} className="canvas" />
            </div>
        </div>
    );
}

interface GraphicsState {
    drawable: GraphicsDrawable;
}

const graphicsReducer = (
    state: GraphicsState,
    action: { fieldName: string; newValue: any; needDraw: boolean }): GraphicsState => {
    state.drawable.model.setValue(action.fieldName, action.newValue);
    if (action.needDraw) {
        state.drawable.draw();
    }

    return { ...state, drawable: state.drawable };
};
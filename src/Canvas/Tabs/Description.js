import Stepper from '../Components/Stepper';

export default function DescriptionTab({ model, dispatch }) {
    return (
        <>
            <div className="image-container" />
            <table className="table">
                <tbody>
                    <tr>
                        <Stepper field='A' value={model.A} dispatch={dispatch} min={model.minA} max={12} />
                        <Stepper field='B' value={model.B} dispatch={dispatch} min={model.minB} max={12} />
                        <Stepper field='C' value={model.C} dispatch={dispatch} min={4} max={12} />
                        <Stepper field='R' value={model.R} dispatch={dispatch} min={1} max={model.maxR} />
                        <Stepper field='dX' value={model.dX} dispatch={dispatch} min={model.mindX} max={model.maxdX} />
                        <Stepper field='dZ' value={model.dZ} dispatch={dispatch} min={model.mindZ} max={model.maxdZ} />
                        <Stepper field='N' value={model.N} dispatch={dispatch} min={4} max={72} step={4} />
                    </tr>
                </tbody>
            </table>
        </>
    );
};
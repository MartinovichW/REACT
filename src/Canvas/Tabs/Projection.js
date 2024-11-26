import Stepper from '../Components/Stepper';

export default function ProjectionTab({ drawable, dispatch }) {
    const handleExtraAction = (code) => {
        drawable.model.calculateProjection(code);
        drawable.draw();
    };

    return (
        <>
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th colSpan="3">Parallel</th>
                    </tr>
                    <tr>
                        <td className="td">
                            <button onClick={() => handleExtraAction("X")}>Profile</button>
                        </td>
                        <td className="td">
                            <button onClick={() => handleExtraAction("Y")}>Horizontal</button>
                        </td>
                        <td className="td">
                            <button onClick={() => handleExtraAction("Z")}>Frontal</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="table-spacing" />
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th className="th" colSpan="3">Axonometric</th>
                    </tr>
                    <tr>
                        <Stepper field='PSI' value={drawable.model.PSI} dispatch={dispatch} min={0} max={360} step={5} needDraw={false} />
                        <Stepper field='FI' value={drawable.model.FI} dispatch={dispatch} min={0} max={360} step={5} needDraw={false} />
                    </tr>
                    <tr>
                        <td className="td" colSpan="2">
                            <button onClick={() => handleExtraAction("A")}>Axonometric</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="table-spacing" />
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th className="th" colSpan="3">Oblique</th>
                    </tr>
                    <tr>
                        <Stepper field='L' value={drawable.model.L} dispatch={dispatch} min={1} max={4} step={1} needDraw={false} />
                        <Stepper field='Alpha' value={drawable.model.Alpha} dispatch={dispatch} min={0} max={360} step={5} needDraw={false} />
                    </tr>
                    <tr>
                        <td className="td" colSpan="2">
                            <button onClick={() => handleExtraAction("O")}>Oblique</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};
import Stepper from '../Components/Stepper';

export default function TransformationTab({ drawable, dispatch }) {
    const handleExtraAction = (code) => {
        drawable.model.calculateTransformation(code);
        drawable.draw();
    };

    return (
        <>
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th colSpan="3">Move</th>
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
                </tbody>
            </table>
            <div className="table-spacing" />
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th className="th" colSpan="3">Scale</th>
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
                </tbody>
            </table>
            <div className="table-spacing" />
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th className="th" colSpan="3">Rotate</th>
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
                </tbody>
            </table>
        </>
    );
};
import GraphicsDrawable from '../BusinessObjects/GraphicsDrawable';
import Stepper from '../Components/Stepper';

interface LightTabProps {
    drawable: GraphicsDrawable;
    dispatch: React.Dispatch<any>;
}

export default function LightTab({ drawable, dispatch }: LightTabProps) {
    const handleExtraAction = (code: string) => {
        drawable.model.calculateLight(code);
        drawable.draw();
    };

    const handleOptionChange = (event: any) => {
        dispatch({ fieldName: 'LightMode', newValue: event.target.value, needDraw: true });
    };

    return (
        <>
            <table className="table">
                <tbody>
                    <tr className="tr">
                        <th colSpan={3}>Light mode</th>
                    </tr>
                    <tr>
                        <td className="td">
                            <input
                                type="radio"
                                id="option1"
                                value="Off"
                                checked={drawable.model.LightMode === 'Off'}
                                onChange={handleOptionChange}
                            />
                            <label htmlFor="option1">Off</label>
                        </td>
                        <td className="td">
                            <input
                                type="radio"
                                id="option2"
                                value="Roberts"
                                checked={drawable.model.LightMode === 'Roberts'}
                                onChange={handleOptionChange}
                            />
                            <label htmlFor="option2">Roberts</label>
                        </td>
                        <td className="td">
                            <input
                                type="radio"
                                id="option3"
                                value="On"
                                checked={drawable.model.LightMode === 'On'}
                                onChange={handleOptionChange}
                            />
                            <label htmlFor="option3">On</label>
                        </td>
                    </tr>
                </tbody>
            </table>
            {drawable.model.LightMode === 'On' &&
                <>
                    <div className="table-spacing" /><table className="table">
                    <tbody>
                        <tr className="tr">
                            <th colSpan={3}>Move light source</th>
                        </tr>
                        <tr>
                            <Stepper field='LDX' value={drawable.model.LDX} dispatch={dispatch} min={1} max={3} needDraw={false}
                                handleExtraAction1={() => handleExtraAction("41")}
                                handleExtraAction2={() => handleExtraAction("42")}
                                extraActionClassName1="btn dxleft"
                                extraActionClassName2="btn dxright" />
                            <Stepper field='LDY' value={drawable.model.LDY} dispatch={dispatch} min={1} max={3} needDraw={false}
                                handleExtraAction1={() => handleExtraAction("43")}
                                handleExtraAction2={() => handleExtraAction("44")}
                                extraActionClassName1="btn dybuttom"
                                extraActionClassName2="btn dytop" />
                            <Stepper field='LDZ' value={drawable.model.LDZ} dispatch={dispatch} min={1} max={3} needDraw={false}
                                handleExtraAction1={() => handleExtraAction("45")}
                                handleExtraAction2={() => handleExtraAction("46")}
                                extraActionClassName1="btn dzleft"
                                extraActionClassName2="btn dzright" />
                        </tr>
                    </tbody>
                </table>
            </>}
        </>
    );
}
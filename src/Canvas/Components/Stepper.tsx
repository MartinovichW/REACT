import React from 'react';

interface StepperProps {
    field: string;
    value: number;
    dispatch: React.Dispatch<any>;
    min: number;
    max: number;
    step?: number;
    needDraw?: boolean;
    handleExtraAction1?: () => void;
    handleExtraAction2?: () => void;
    extraActionClassName1?: string;
    extraActionClassName2?: string;
}

export default function Stepper({
    field,
    value,
    dispatch,
    min,
    max,
    step = 1,
    needDraw = true,
    handleExtraAction1 = undefined,
    handleExtraAction2 = undefined,
    extraActionClassName1 = undefined,
    extraActionClassName2 = undefined
}: StepperProps) {
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
}
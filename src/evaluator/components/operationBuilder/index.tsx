import React, { useState } from 'react';
import { Argument, BaseExpression } from '../../model';
import { ArgumentsList } from '../argumentsList';
import { ExpressionItem } from '../expressionItem';


export const OperationBuilder = () => {

    const [argumentValues, setArgumentValues] = useState<Argument[]>([]);
    const [result, setResult] = useState<boolean>()

    const addNewArgument = (newArgument: Argument) => {
        setArgumentValues([...argumentValues.filter(a => a.Id !== newArgument.Id), newArgument]);
    }

    const onExpressionValueChanged = (value: boolean) =>  setResult(value);

    console.log(result)

    return <>
        <ArgumentsList argumentValues={argumentValues} updateArgument={addNewArgument} />

        <ExpressionItem argumentValues={argumentValues}  onExpressionValueChanged={onExpressionValueChanged}/>


        <div>
            result: {result ? "true" : "false"}
        </div>
    </>
}
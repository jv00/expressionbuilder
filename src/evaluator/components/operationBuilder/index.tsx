import { Paper } from '@mui/material';
import React, { useState } from 'react';
import { Argument } from '../../model';
import { ArgumentsList } from '../argumentsList';
import { ExpressionItem } from '../expressionItem';


export const OperationBuilder = () => {

    const [argumentValues, setArgumentValues] = useState<Argument[]>([]);
    const [result, setResult] = useState<boolean>()

    const addNewArgument = (newArgument: Argument) => {
        setArgumentValues([...argumentValues.filter(a => a.Id !== newArgument.Id), newArgument]);
    }

    const onExpressionValueChanged = (value: boolean) =>  setResult(value);

    return <>
        <ArgumentsList argumentValues={argumentValues} updateArgument={addNewArgument} />

        <Paper style={{ marginBlock: '1rem', padding: '1rem'}}>
        <ExpressionItem argumentValues={argumentValues}  onExpressionValueChanged={onExpressionValueChanged}/>

        </Paper>
     

        <div>
            result: {result ? "true" : "false"}
        </div>
    </>
}
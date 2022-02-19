import { Paper } from '@mui/material';
import { v4 as uuid } from 'uuid';
import React, { useState } from 'react';
import { Argument, ExpressionNode } from '../../model';
import { ArgumentsList } from '../argumentsList';
import { ExpressionItem } from '../expressionItem';


export const OperationBuilder = () => {

    const [argumentValues, setArgumentValues] = useState<{ [key: string]: Argument }>({});
    const [result, setResult] = useState<boolean>()
    const [rootNode, setRootNode] = useState<ExpressionNode>({ Id: uuid(), Value: true })

    const addNewArgument = (newArgument: Argument) => {
        const newArgs = Object.assign({}, argumentValues, { [newArgument.Id] : newArgument })
        setArgumentValues(newArgs);
    }

    const onExpressionValueChanged = (value: boolean) =>  setResult(value);

    return <>
        <ArgumentsList argumentValues={argumentValues} updateArgument={addNewArgument} />
        <Paper style={{ marginBlock: '1rem', padding: '1rem'}}>
        <ExpressionItem expressionNode={rootNode} argumentValues={argumentValues}  onExpressionValueChanged={onExpressionValueChanged}/>
        </Paper>
    
        <div>
            result: {result ? "true" : "false"}
        </div>
    </>
}
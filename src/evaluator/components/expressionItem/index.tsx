import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Argument, ExpressionNode } from '../../model';

const ExpressionTypes: { [key: string]: string } = {
    select: "select",
    constant: "constant",
    argument: "argument",
    and: "and",
    or: "or"
}


interface ExpressionItemProps {
    onExpressionValueChanged(value: boolean, nodeId?: string): void;
}

interface ArgumentsExpressionItemProps extends ExpressionItemProps{
    onExpressionValueChanged(value: boolean, nodeId?: string): void;
    argumentValues: { [key: string]: Argument }
}

export const ExpressionItem = (props: ArgumentsExpressionItemProps) => {

    const { onExpressionValueChanged, argumentValues } = props;

    const [selectedType, setSelectedType] = useState<string>(ExpressionTypes.select);
    const [nodeId, setNodeId] = useState<string>()

    const [expressionNodes, setExpressionNodes] = useState<ExpressionNode[]>([]);

    const [numberOfOperands, setNumberOfOperands] = useState<number>(0);

    const onChange = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value);
    }

    const onNodeValueChange = (value: boolean, childNodeId?: string) => {
        if (childNodeId) {
            const filteredNodes = expressionNodes.filter(n => n.Id !== childNodeId);
            setExpressionNodes([...filteredNodes, { Id: childNodeId, Value: value }]);
        }
    }

    const onAddMoreOperands = () => {
        setNumberOfOperands(numberOfOperands + 1);
    }

    const onDeleteClick = () => {
        setSelectedType(ExpressionTypes.select);
        setExpressionNodes([]);
        setNumberOfOperands(0);
    }

    useEffect(() => {
        if (selectedType === ExpressionTypes.and) {
            const result = expressionNodes.reduce((res, c) => res && c.Value, true);
            onExpressionValueChanged(result, nodeId);
        }
        else if (selectedType === ExpressionTypes.or) {
            const result = expressionNodes.reduce((res, c) => res || c.Value, false);
            onExpressionValueChanged(result, nodeId);
        }
        else
            onExpressionValueChanged(expressionNodes[0]?.Value, nodeId);
    }, [expressionNodes, selectedType]);


    useEffect(() => {
        setNodeId(uuid());
    }, []);


    if (selectedType === ExpressionTypes.select)
        return <Select onChange={onChange} value={selectedType} fullWidth>
            {Object.keys(ExpressionTypes).map((k: string) => <MenuItem key={k} value={ExpressionTypes[k]}>{ExpressionTypes[k]}</MenuItem>)}
        </Select>
    else if (selectedType === ExpressionTypes.constant)
        return <div>
            <ConstantExpressionItem onExpressionValueChanged={onNodeValueChange} />
            <IconButton onClick={onDeleteClick}><DeleteIcon /></IconButton>
        </div>
    else if (selectedType === ExpressionTypes.argument)
        return <div>
            <ArgumentExpressionItem
                argumentValues={argumentValues}
                onExpressionValueChanged={onNodeValueChange} />
            <IconButton onClick={onDeleteClick}><DeleteIcon /></IconButton>
        </div>
    else if (selectedType === ExpressionTypes.and)
        return <div style={{ paddingLeft: '0.5rem' }}>
            <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues} />
            <Typography variant="h6" align='center'>
                And
            </Typography>

            <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues} />
            {[...Array(numberOfOperands)].map((e, i) => <>  <Typography variant="h6" align='center'>
                And
            </Typography><ExpressionItem key={i} onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues} />
            </>)}
            <Button variant='outlined' onClick={onAddMoreOperands}>Add Operand</Button>
        </div>
    else if (selectedType === ExpressionTypes.or)
        return <div style={{ paddingLeft: '0.5rem' }}>
            <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues} />
            <Typography variant="h6" align='center'>
                Or
            </Typography>
            <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues} />
            {[...Array(numberOfOperands)].map((e, i) => <>  <Typography variant="h6" align='center'>
                Or
            </Typography> <ExpressionItem key={i} onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues} />
            </>)}
            <Button variant='outlined' onClick={onAddMoreOperands}>Add Operand</Button>
        </div>
    return <></>
}

const ConstantExpressionItem = (props: ExpressionItemProps) => {

    const { onExpressionValueChanged } = props;

    const [value, setValue] = useState<boolean>(false)
    const [nodeId, setNodeId] = useState<string>()

    const onValueChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value === 'false' ? false : true;
        setValue(newValue);
        onExpressionValueChanged(newValue, nodeId);
    }

    useEffect(() => {
        const id = uuid();
        setNodeId(id);
        onExpressionValueChanged(false, id);
    }, []);

    return <Select value={value ? 'true' : 'false'} onChange={onValueChange}>
        <MenuItem value={'false'}>False</MenuItem >
        <MenuItem value={'true'}>True</MenuItem >
    </Select>
}

const ArgumentExpressionItem = (props: ArgumentsExpressionItemProps) => {

    const { onExpressionValueChanged, argumentValues } = props;

    const [argumentId, setArgumentId] = useState<string>('select')
    const [nodeId, setNodeId] = useState<string>()

    const onValueChange = (event: SelectChangeEvent) => {
        const newValue = argumentValues[event.target.value];
        if (newValue) {
            setArgumentId(newValue?.Id)
            onExpressionValueChanged(newValue?.Value || false, nodeId);
        }
    }

    useEffect(() => {
        const newValue = argumentValues[argumentId];
        onExpressionValueChanged(newValue?.Value || false, nodeId);
    }, [argumentValues]);

    useEffect(() => {
        setNodeId(uuid());
    }, []);

    return <Select value={argumentId} onChange={onValueChange}>
        <MenuItem value={'select'}>select</MenuItem>
        {Object.keys(argumentValues).map((k: string) => <MenuItem key={k} value={k}>{argumentValues[k].Name}</MenuItem>)}
    </Select>
}


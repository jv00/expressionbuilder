import { useEffect, useState } from 'react';
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
    expressionNode: ExpressionNode,
    onDeleteClick?: () => void
}

interface ArgumentsExpressionItemProps extends ExpressionItemProps {
    onExpressionValueChanged(value: boolean, nodeId?: string): void;
    argumentValues: { [key: string]: Argument }
}

export const ExpressionItem = (props: ArgumentsExpressionItemProps) => {

    const { onExpressionValueChanged, argumentValues, expressionNode } = props;

    const [selectedType, setSelectedType] = useState<string>(ExpressionTypes.select);

    const [expressionNodes, setExpressionNodes] = useState<{ [key: string]: ExpressionNode }>({});

    const onExpressionTypeChange = (event: SelectChangeEvent) => {
        if ([ExpressionTypes.and, ExpressionTypes.or].includes(event.target.value)) {
            const firstOperand = InitializeExpressionNode();
            const secondOperand = InitializeExpressionNode();
            const newNodes = Object.assign({}, expressionNodes, { [firstOperand.Id]: firstOperand }, { [secondOperand.Id]: secondOperand })
            setExpressionNodes(newNodes);
        }
        else {
            const firstOperand = InitializeExpressionNode();
            const newNodes = Object.assign({}, expressionNodes, { [firstOperand.Id]: firstOperand })
            setExpressionNodes(newNodes)
        }

        setSelectedType(event.target.value);
    }

    const onOperatorChange = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value)
    }

    const InitializeExpressionNode = (): ExpressionNode => {
        return { Id: uuid(), Value: true };
    }

    const onNodeValueChange = (value: boolean, childNodeId?: string) => {
        if (childNodeId) {
            const newNodes = Object.assign({}, expressionNodes, { [childNodeId]: { Id: childNodeId, Value: value } })
            setExpressionNodes(newNodes);
        }
    }

    const onAddMoreOperands = () => {
        const newOperand = InitializeExpressionNode();
        const newNodes = Object.assign({}, expressionNodes, { [newOperand.Id]: newOperand })
        setExpressionNodes(newNodes)
    }

    const onDeleteClick = () => {
        setSelectedType(ExpressionTypes.select);
        setExpressionNodes({});
    }

    useEffect(() => {
        if (selectedType === ExpressionTypes.and) {
            const result = Object.values(expressionNodes).reduce((res, c) => res && c.Value, true);
            onExpressionValueChanged(result, expressionNode.Id);
        }
        else if (selectedType === ExpressionTypes.or) {
            const result = Object.values(expressionNodes).reduce((res, c) => res || c.Value, false);
            onExpressionValueChanged(result, expressionNode.Id);
        }
        else
            onExpressionValueChanged(Object.values(expressionNodes)[0]?.Value, expressionNode.Id);
    }, [expressionNodes, selectedType]);


    return <>
        {GetView(
            {
                onNodeValueChange: onNodeValueChange,
                onExpressionTypeChange: onExpressionTypeChange,
                onDeleteClick: onDeleteClick,
                onOperatorChange: onOperatorChange,
                onAddMoreOperands: onAddMoreOperands,
                selectedType: selectedType,
                expressionNodes: expressionNodes,
                argumentValues: argumentValues
            })[selectedType]}
    </>
}

interface NodeViewProps {
    onNodeValueChange: (value: boolean, childNodeId?: string) => void,
    onExpressionTypeChange: (event: SelectChangeEvent) => void,
    onDeleteClick: () => void,
    onOperatorChange: (event: SelectChangeEvent) => void,
    onAddMoreOperands: () => void,
    selectedType: string,
    expressionNodes: { [key: string]: ExpressionNode },
    argumentValues: { [key: string]: Argument }
}

const GetView = (props: NodeViewProps) => ({
    [ExpressionTypes.select]: <Select onChange={props.onExpressionTypeChange} value={props.selectedType} fullWidth>
        {Object.keys(ExpressionTypes).map((k: string) => <MenuItem key={k} value={ExpressionTypes[k]}>{ExpressionTypes[k]}</MenuItem>)}
    </Select>,
    [ExpressionTypes.constant]: <ConstantExpressionItem
        onExpressionValueChanged={props.onNodeValueChange}
        onDeleteClick={props.onDeleteClick}
        expressionNode={Object.values(props.expressionNodes)[0]} />
    ,
    [ExpressionTypes.argument]: <ArgumentExpressionItem
        argumentValues={props.argumentValues}
        onExpressionValueChanged={props.onNodeValueChange}
        onDeleteClick={props.onDeleteClick}
        expressionNode={Object.values(props.expressionNodes)[0]} />
    ,
    [ExpressionTypes.and]: <OperatorExpressionItemView {...props} />,
    [ExpressionTypes.or]: <OperatorExpressionItemView {...props} />,
})

const OperatorExpressionItemView = (props: NodeViewProps) => {

    const { selectedType, onDeleteClick, onOperatorChange, expressionNodes, onNodeValueChange, onAddMoreOperands, argumentValues } = props;

    return <>
        <div style={{ paddingLeft: '0.5rem' }}>
            <div style={{ display: 'flex' }}>
                <Select value={selectedType} onChange={onOperatorChange}>
                    <MenuItem value={ExpressionTypes.or}>Or</MenuItem >
                    <MenuItem value={ExpressionTypes.and}>And</MenuItem >
                </Select>
                <IconButton onClick={onDeleteClick}><DeleteIcon /></IconButton>
            </div>
            {Object.values(expressionNodes).map(e => <ExpressionItem
                key={e.Id}
                onExpressionValueChanged={onNodeValueChange}
                argumentValues={argumentValues}
                expressionNode={e} />)}
            <Button variant='outlined' onClick={onAddMoreOperands}>Add Operand</Button>
        </div>
    </>
}

const ConstantExpressionItem = (props: ExpressionItemProps) => {

    const { onExpressionValueChanged, onDeleteClick, expressionNode } = props;

    const [value, setValue] = useState<boolean>(false)

    const onValueChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value === 'false' ? false : true;
        setValue(newValue);
        onExpressionValueChanged(newValue, expressionNode.Id);
    }

    useEffect(() => {
        if (value !== expressionNode.Value)
            onExpressionValueChanged(value, expressionNode.Id);
    }, [value]);

    return <div>
        <Select value={value ? 'true' : 'false'} onChange={onValueChange}>
            <MenuItem value={'false'}>False</MenuItem >
            <MenuItem value={'true'}>True</MenuItem >
        </Select>
        <IconButton onClick={onDeleteClick}><DeleteIcon /></IconButton>
    </div>
}

const ArgumentExpressionItem = (props: ArgumentsExpressionItemProps) => {

    const { onExpressionValueChanged, onDeleteClick, argumentValues, expressionNode } = props;

    const [argumentId, setArgumentId] = useState<string>('select');
    const onValueChange = (event: SelectChangeEvent) => {
        const newValue = argumentValues[event.target.value];
        if (newValue) {
            setArgumentId(newValue?.Id)
            onExpressionValueChanged(newValue?.Value || false, expressionNode.Id);
        }
    }

    useEffect(() => {
        const newValue = argumentValues[argumentId];
        onExpressionValueChanged(newValue?.Value || false, expressionNode.Id);
    }, [argumentValues]);

    return <div>
        <Select value={argumentId} onChange={onValueChange}>
            <MenuItem value={'select'}>select</MenuItem>
            {Object.keys(argumentValues).map((k: string) => <MenuItem key={k} value={k}>{argumentValues[k].Name}</MenuItem>)}
        </Select>
        <IconButton onClick={onDeleteClick}><DeleteIcon /></IconButton>
    </div>
}


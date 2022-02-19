import React, { ChangeEvent, useEffect, useState } from 'react';
import { Argument, BaseExpression, ConstantExpression } from '../../model';
import { v4 as uuid } from 'uuid';

const ExpressionTypes: { [key: string]: string } = {
    select: "select",
    constant: "constant",
    argument: "argument",
    and: "and",
    or: "or"
}


interface ExpressionItemProps {
    onExpressionValueChanged(value: boolean, nodeId?: string): void;
    argumentValues?: Argument[]
}

export const ExpressionItem = (props: ExpressionItemProps) => {

    const { onExpressionValueChanged, argumentValues } = props;

    const [selectedType, setSelectedType] = useState<string>(ExpressionTypes.select);
    const [nodeId, setNodeId] = useState<string>()

    const [expressionNodes, setExpressionNodes] = useState<ExpressionNode[]>([]);

    const [numberOfOperands, setNumberOfOperands] = useState<number>(0);

    const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.currentTarget.value);
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

    useEffect(() => {
        if(selectedType === ExpressionTypes.and)
        {
            const result = expressionNodes.reduce((res, c) => res && c.Value, true);
            onExpressionValueChanged(result, nodeId);
        }
        else if(selectedType === ExpressionTypes.or)
        {
            const result = expressionNodes.reduce((res, c) => res || c.Value, true);
            onExpressionValueChanged(result, nodeId);
        }
        else
            onExpressionValueChanged(expressionNodes[0]?.Value, nodeId);
    }, [expressionNodes, selectedType]);


    useEffect(() => {
        setNodeId(uuid());
    }, []);


    if (selectedType === ExpressionTypes.select)
        return <div>
            <select onChange={onChange}>
                {Object.keys(ExpressionTypes).map((k: string) => <option key={k} value={ExpressionTypes[k]}>{ExpressionTypes[k]}</option>)}
            </select>
        </div>
    else if (selectedType === ExpressionTypes.constant)
        return <>
            <ConstantExpressionItem onExpressionValueChanged={onNodeValueChange} />
            <button>x</button>
        </>
    else if (selectedType === ExpressionTypes.argument)
        return <>
            <ArgumentExpressionItem
                argumentValues={argumentValues}
                onExpressionValueChanged={onNodeValueChange} />
            <button>x</button>
        </>
    else if (selectedType === ExpressionTypes.and)
        return <div>
            And
            <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues}/>
            <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues}/>
            {[...Array(numberOfOperands)].map((e, i) => <ExpressionItem key={i} onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues}/>)}
            <button onClick={onAddMoreOperands}>Add op</button>
        </div>
    else if (selectedType === ExpressionTypes.or)
    return <div>
        Or
        <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues}/>
        <ExpressionItem onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues}/>
        {[...Array(numberOfOperands)].map((e, i) => <ExpressionItem key={i} onExpressionValueChanged={onNodeValueChange} argumentValues={argumentValues}/>)}
        <button onClick={onAddMoreOperands}>Add op</button>
    </div>


    return <></>
}

const ConstantExpressionItem = (props: ExpressionItemProps) => {

    const { onExpressionValueChanged } = props;

    const [value, setValue] = useState<boolean>(false)
    const [nodeId, setNodeId] = useState<string>()

    const onValueChange = (event: ChangeEvent<HTMLSelectElement>) => {

        const newValue = event.currentTarget.value === '0' ? false : true;

        setValue(newValue);


        onExpressionValueChanged(newValue, nodeId);

    }

    useEffect(() => {
        const id = uuid();
        setNodeId(id);
        onExpressionValueChanged(false, id);
    }, []);

    return <select value={value ? 1 : 0} onChange={onValueChange}>
        <option value={0}>False</option>
        <option value={1}>True</option>
    </select>
}

const ArgumentExpressionItem = (props: ExpressionItemProps) => {

    const { onExpressionValueChanged, argumentValues } = props;

    const [argumentId, setArgumentId] = useState<string>()
    const [nodeId, setNodeId] = useState<string>()

    const onValueChange = (event: ChangeEvent<HTMLSelectElement>) => {

        

        const newValue = argumentValues?.find(a => a.Id === event.currentTarget.value);


        setArgumentId(newValue?.Id)
        onExpressionValueChanged(newValue?.Value || false, nodeId);
    }

    useEffect(() => {
        const newValue = argumentValues?.find(a => a.Id === argumentId);
        onExpressionValueChanged(newValue?.Value || false, nodeId);
    }, [argumentValues]);

    useEffect(() => {
        setNodeId(uuid());
    }, []);

    return <select value={argumentId} onChange={onValueChange}>
        <option >select</option>
        {argumentValues?.map(a => <option key={a.Id} value={a.Id}>{a.Name}</option>)}
    </select>
}


interface ExpressionNode {
    Id: string,
    Value: boolean
} 
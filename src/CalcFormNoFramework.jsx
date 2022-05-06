import './App.css';
import { Form, Table, Button, Row, Col, InputGroup, FormControl, Container } from 'react-bootstrap';
import React, { useState, useCallback, useMemo } from 'react';
import { set } from 'lodash';

//  Using memoized components here helps a ton with uneccessary re-renders
const MemoizedTotalField = ({name, label, value, onChange, readOnly = false}) => (useMemo(() => (<Row className="mb-1">
      <Col md={{ span: 3, offset: 5 }} className="text-end">
        <Form.Label column>{label}:</Form.Label>
      </Col>
      <Col md={{ span: 4 }}>
        <InputGroup>
          <InputGroup.Text>$</InputGroup.Text>
          <FormControl className="text-end" value={value} name={name} onChange={onChange} readOnly={readOnly}/>
        </InputGroup>
      </Col>
    </Row>)
    , [label, value, name, onChange, readOnly]));

const MemoizedItemRow = ({ itemId, itemName, quantity, unitPrice, extendedPrice, ix, onChange}) => (useMemo(() => (<tr key={itemId}>
  <td>
    <FormControl name={`items[${ix}].itemName`} value={itemName} onChange={onChange} />
  </td>
  <td>
    <FormControl name={`items[${ix}].quantity`} value={quantity} onChange={onChange} />
  </td>
  <td>
    <FormControl name={`items[${ix}].unitPrice`} value={unitPrice} onChange={onChange} />
  </td>
  <td>
    <FormControl readOnly value={extendedPrice} onChange={onChange} />
  </td>
</tr>), [extendedPrice, itemId, itemName, ix, onChange, quantity, unitPrice]));



export const CalcFormNoFramework = () => {
  const [data, setData] = useState({items: [], subTotal: 0, taxes: 0, shipping: 0, total: 0});
  
  const createNewDataFromOld = (oldData, event) => {
    const newData = { ...oldData, items: oldData.items.map(item => ({ ...item })) };

    //  Update the new value
    set(newData, event.target.name, event.target.value);

    //  Calculate extended price for each item
    newData.items = newData.items.map(item => ({ ...item, extendedPrice: Number(item.quantity) * Number(item.unitPrice) }));

    //  Calculate sub total
    newData.subTotal = newData.items.reduce((total, item) => total + item.extendedPrice, 0);

    //  Calculate total
    newData.total = Number(newData.subTotal) + Number(newData.taxes) + Number(newData.shipping);
    return newData;
  }


  //  This version does a lot less re-rerendering
  const handleDataChange2 = useCallback(event => {
    setData(oldData => createNewDataFromOld(oldData, event));
  },[]);

  //  Everything gets re-rendered when using this version
  const handleDataChange = useCallback(event => {
    setData(createNewDataFromOld(data, event));
  }, [data]);

  

  const handleAddItem = useCallback(() => {
    setData(newData => ({ ...newData, items: [...newData.items, { itemId: newData.items.length + 1, itemName: "", quantity: 0, unitPrice: 0, extendedPrice: 0 }]}));
  },[]);

  return (
    <React.Fragment>
    <Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit Price</th> 
            <th>Extended Price</th>
          </tr>
        </thead>
        <tbody>
          {data.items.length < 1 && <tr><td colspan="4">No Items</td></tr>}
          {data.items.length > 0 && data.items.map((item, i) => (<MemoizedItemRow itemId={item.itemId} itemName={item.itemName} quantity={item.quantity} unitPrice={item.unitPrice} extendedPrice={item.extendedPrice} ix={i} onChange={handleDataChange} />))}
        </tbody>
        <tfoot>
          <tr>
            <th colspan="4">
              <Button className="float-end" onClick={handleAddItem}>Add Item</Button>
            </th>
          </tr>
        </tfoot>
      </Table>
      <Container className="p-0">
        <MemoizedTotalField name="subTotal" label="Sub Total" value={data.subTotal} onChange={handleDataChange} readOnly />
        <MemoizedTotalField name="taxes" label="Taxes" value={data.taxes} onChange={handleDataChange} />
        <MemoizedTotalField name="shipping" label="Shipping" value={data.shipping} onChange={handleDataChange} />
        <MemoizedTotalField name="total" label="Total" value={data.total} onChange={handleDataChange} readOnly />
      </Container>
      <textarea className="text-start" style={{width: "100%", height: "250px", "marginTop": "10px"}} value={JSON.stringify(data, null, 2)}/>
    </Form>
    </React.Fragment>
  );
};



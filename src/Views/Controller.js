import styled from "styled-components"
import Pdf from "react-to-pdf"
import React, { createRef, useEffect, useState } from "react";

import Api from '../Api'

import { Table, Button, Form, FormGroup, Input } from 'reactstrap';


const Controller = () => {

  const ref = createRef();

  const [modal, setModal] = useState(false);
  const [valorEntrada, setValorEntrada] = useState(0)
  const [valorSaida, setValorSaida] = useState(0)

  const data = new Date();
  let dia = `${data.getDate().toString().padStart(2, '0') + "/" + ((data.getMonth() + 1)).toString().padStart(2, '0') + "/" + data.getFullYear()}`

  const [controle, setControle] = useState({
    data: dia,
    descricao: '',
    valor: 0,
    entra: 1
  })

  const onChanger = (e) => {
    setControle({ ...controle, [e.target.name]: e.target.value })
  }

  const [entrada, setEntrada] = useState([])

  const [saida, setSaida] = useState([])


  useEffect(() => {
    Api.get("/").then(response => {

      if (response.data.controle.length > 0) {

        response.data.controle.forEach((item) => {
          if (item.data === dia) {

            if (item.entrada === 0) {
              setValorSaida(valor => valor + item.valor)
              setSaida(e => [...e, item])
            } else {
              setValorEntrada(valor => valor + item.valor)

              setEntrada(e => [...e, item])
            }

          }
        });
      }
    }).catch(e => {
      console.log(e)
    })
  }, [dia])

  const toggle = () => setModal(!modal);




  const subMit = (e) => {
    e.preventDefault()
    let contro = controle
    contro.valor = parseFloat(controle.valor)
    Api.post("/", controle).then(response => {
      if (response.data.controle.entrada === 0) {
        setValorSaida(valor => valor + response.data.controle.valor)
        setSaida(e => [...e, response.data.controle])
        setControle({
          data: dia,
          descricao: '',
          valor: 0,
          entra: 1
        })
        toggle()
      } else {
        setValorEntrada(valor => valor + response.data.controle.valor)
        setEntrada(e => [...e, response.data.controle])
      }
    }).catch(e => {
      console.log(e.response.data)
    })
  }


  return (
    <Container>
      <Title>
        GUEDES CONTRUÇÔES
      </Title>
      <Grid>
        <Left>
          <Button color="danger" onClick={toggle} style={{
            marginRight: 10
          }}>abrir</Button>

          <Pdf targetRef={ref} filename={`Caixa_do_${data.getDate() + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear()}.pdf`}>
            {({ toPdf }) => <Button onClick={toPdf} color="primary">Gerar Relatorio</Button>}
          </Pdf>
        </Left>
        <Right ref={ref}>
          <h2 style={{
            fontSize: 18,
            fontWeight: 'normal'
          }}>{`Caixa do dia ${dia}`}</h2>
          <div className="context">
            <Table hover>
              <caption> Entradas</caption>
              <thead>
                <tr>
                  <th>Cód</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                {entrada.length > 0 ? entrada.map((tr, index) => {
                  return (
                    <tr key={index + 1}>
                      <td>{index + 1}</td>
                      <td>{tr.descricao}</td>
                      <td>{tr.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    </tr>
                  )
                }) : (
                    <tr>
                      <td colSpan="3">
                        Não a entradas
                      </td>
                    </tr>
                  )}

              </tbody>
              <tfoot>
                <tr className="total">
                  <td colSpan="2">Total</td>
                  <td>{valorEntrada.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                </tr>
              </tfoot>
            </Table>

            <Table hover>
              <caption>Saida</caption>
              <thead>
                <tr>
                  <th className="saida">Cód</th>
                  <th className="saida">Descrição</th>
                  <th className="saida">Valor</th>
                </tr>
              </thead>

              <tbody>
                {saida.length > 0 ? saida.map((tr, index) => {
                  return (
                    <tr key={tr._id}>
                      <td>{index + 1}</td>
                      <td>{tr.descricao}</td>
                      <td>{tr.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                    </tr>
                  )
                }) : (
                    <tr>
                      <td colSpan="3">
                        Não a saidas
                      </td>
                    </tr>
                  )}

              </tbody>
              <tfoot>
                <tr className="total">
                  <td colSpan="2">Total</td>
                  <td>{valorSaida.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Right>
      </Grid>
      <div className={`modal ${modal ? "active" : ""}`}>
        <Form onSubmit={subMit} style={{
          width: '90%',
          maxWidth: 450,
          backgroundColor: '#fff',
          padding: '20px 25px',
          borderRadius: 7
        }}>
          <Title style={{
            borderRadius: 5
          }}>
            entrada / Saida
        </Title>
          <FormGroup>
            <Input type="text" name="data" id="data" placeholder="Data" value={controle.data} onChange={onChanger} disabled />
          </FormGroup>

          <FormGroup>
            <Input type="text" name="descricao" id="descricao" placeholder="Descrição" value={controle.descricao} onChange={onChanger} />
          </FormGroup>

          <FormGroup>
            <Input type="text" name="valor" id="valor" placeholder="Valor" value={controle.valor} onChange={onChanger} />
          </FormGroup>
          <FormGroup>
            <Input type="select" name="entrada" id="exampleSelect" defaultValue={controle.entra} onChange={onChanger}>
              <option value="1">Entrada</option>
              <option value="0">Saida</option>

            </Input>
          </FormGroup>
          <FormGroup >
            <Button type="submit" color="success">Salvar</Button>
            <Button type="button" color="danger" onClick={toggle} style={{
              marginLeft: 5
            }}>Cancelar</Button>
          </FormGroup>
        </Form>
      </div>
    </Container >
  )
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  .modal{
    width: 100%;
    height: 100%;
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(0,0,0,.5);
    &.active{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  th{
    background-color: #333;
    color: #fff;
  }
`

const Title = styled.h2`
  width: 100%;
  padding: 15px;
  text-align: center;
  font-weight: 500;
  font-size: 18px;
  background-color: #333;
  color: #fff;
`

const Grid = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 10px;
  padding: 10px 20px;
  grid-template-columns: 1fr;
  align-items:flex-start;
  position: relative; 
`

const Left = styled.div`
background-color: transparent;
display: flex;
flex-direction: row;
justify-content:flex-start;
align-items: center;

`
const Right = styled.div`
  
  h2{
    width: 100%;
    padding: 7px;
    text-align: center;
  }
  .total{
    background-color: #ccc;
    td{
      font-weight: 600;
    }
  }
  .context{
    width: 100%;
    padding: 10px;
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
    @media screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
    }
  }
`

export default Controller
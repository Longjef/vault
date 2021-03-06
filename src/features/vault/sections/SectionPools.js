import React, { useState, useEffect } from 'react';
import BigNumber from "bignumber.js";
// @material-ui/core components
import Grid from '@material-ui/core/Grid';
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Avatar from '@material-ui/core/Avatar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
// sections for this section
import SectionOpenedPool from "./SectionOpenedPool";
//  hooks
import { useAccount } from '../../common/redux/hooks';
import { useFetchBalances, useFetchPoolBalances, useFetchPrice } from '../redux/hooks';

import logo from 'images/SNX-logo.png'

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";

const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPools() {
  const { account, provider } = useAccount();
  const { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { tokens, fetchBalances } = useFetchBalances();
  const { price, fetchPrice } = useFetchPrice();
  const [ openedCardList, setOpenCardList ] = useState([]);
  const classes = useStyles();

  const openCard = id => {
    return setOpenCardList(
      openedCardList => {
        if(openedCardList.includes(id)) {
          return openedCardList.filter(item => item!==id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  } 

  useEffect(() => {
    fetchBalances({account, provider, tokens});
  }, [account, provider,fetchBalances]);

  useEffect(() => {
    fetchPoolBalances({account, provider, pools, price});
  }, [account, provider, price, fetchPoolBalances]);
  
  useEffect(() => {
    fetchPrice();
  }, [account, provider,fetchPoolBalances]);

  const byDecimals = number => {
    // console.log(number)
    const decimals = new BigNumber(10).exponentiatedBy(18);
    // console.log(new BigNumber(number).dividedBy(decimals || 0).toFormat(4))
    return new BigNumber(number).dividedBy(decimals || 0).toFormat(4);
  }
  
  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={10}>
        {pools.map((pool, index) => {
          return openedCardList.includes(index) ? (
            <SectionOpenedPool closeCard={openCard.bind(this, index)} pool={pool} index={index} key={index}/>
            ) : (
            <Card key={index}
              style={{
                borderRadius: "50rem",
                borderStyle: "solid",
                borderWidth: "2px",
                backgroudColor: "#f2f2f2",
                // borderColor: "rgb(233, 30, 99)",
                boxShadow: "0 0",
                // opacity: 0.5
                
              }}
            >
              <CardBody style={{ 
                display: "flex",
                justifyContent : "space-around",
                alignItems : "center",
                alignContent: "space-around",
                backgroudColor: "#f2f2f2",
              }}>
                <Avatar alt={pool.token} src={require(`../../../images/${pool.token}-logo.png`)} />
                <div
                  style={{
                    fontSize: "1.5rem"
                  }}
                >{byDecimals(tokens[pool.token].tokenBalance)}</div>
                <div>
                  <h5>{pool.token}</h5>
                  <h6>Balance</h6>
                </div>
                <div>
                  <h5>{byDecimals(pool.depositedBalance)}</h5>
                  <h6>Deposited { pool.token }</h6>
                </div>
                <div>
                  <h5>{byDecimals(pool.claimAbleBalance)}</h5>
                  <h6>Earned { pool.earnedToken }</h6>
                </div>
                <div>
                  <h5>{byDecimals(pool.claimPendingBalance)}</h5>
                  <h6>Pending { pool.earnedToken }</h6>
                </div>
                <div><ArrowDropDownIcon onClick={openCard.bind(this, index)} fontSize="large"/></div>
              </CardBody>
            </Card>
          )
        })}
      </GridItem>
    </GridContainer>
  )
}

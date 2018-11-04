import React, {Component} from 'react'
import IconButton from 'material-ui/IconButton'
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import {List, ListItem} from 'material-ui/List'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up'
import ErrorPage from './ErrorPage'
import {FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET} from "../api/APIkey";

class InfoTab extends Component {
  state = {
    imageSrc: '',
    address: '',
    formattedAddress: '',
    coordinates: [],
    categories: [],
    phoneContact: '',
    twitterContact: '',
    facebookContact: '',
    url: '',
    openStatus: '',
    timeFrames: [],
    popularTimes: [],
    rating: -1.0,
    tip: '',
    menuUrl: '',
    menuMobileUrl: '',
    price: '',
    description: '',
    likesCount: -1,
    location: '',
    infoLoaded: true,
  }
}
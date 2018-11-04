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

  componentDidCatch() {
    fetch(`https://api.foursquare.com/v2/venues/search?ll=33.888928,-118.393534&client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20130815&near&query=${this.props.currentPlace}&limit=1`)
      .then((res) => res.text())
      .then((text) => {
        let formattedResponse = JSON.parse(text).response.venues[0];
        this.setState({
          address: formattedResponse.location.crossStreet,
          formattedAddress: formattedResponse.location.formattedAddress[0] + ', ' + formattedResponse.location.formattedAddress[1],
          coordinates: [formattedResponse.location.lat, formattedResponse.location.lng]
        })
        return formattedResponse.id
      })
      .then((id) => {
        fetch(`https://api.foursquare.com/v2/venues/${id}?client_id=${FOURSQUARE_CLIENT_ID}&client_secret=${FOURSQUARE_CLIENT_SECRET}&v=20130815`)
          .then((res) => res.text())
          .then((text) => {
            let allData = JSON.parse(text).response.venue
            this.setState({
              categories: allData.categories,
              phoneContact: (allData.hasOwnProperty('contact') && allData.contact.hasOwnProperty('formattedPhone')) ?
                allData.contact.formattedPhone : '',
              twitterContact: (allData.hasOwnProperty('contact') && allData.contact.hasOwnProperty('twitter')) ?
                allData.contact.twitter : '',
              facebookContact: (allData.hasOwnProperty('contact') && allData.contact.hasOwnProperty('facebookName')) ?
                allData.contact.facebookName : '',
              url: (allData.hasOwnProperty('url')) ? allData.url : '',
              openStatus: ((allData.hasOwnProperty('hours') && allData.hours.hasOwnProperty('status')) ?
                allData.hours.status : ''),
              timeFrames: ((allData.hasOwnProperty('hours') && allData.hours.hasOwnProperty('timeframes')) ?
                allData.hours.timeframes : []),
              popularTimes: ((allData.hasOwnProperty('popular') && allData.popular.hasOwnProperty('timeframes')) ?
                allData.popular.timeframes : []),
              rating: (allData.hasOwnProperty('rating') ? allData.rating : -1.0),
              tip: ((allData.hasOwnProperty('tips') &&
                allData.tips.hasOwnProperty('groups') &&
                (allData.tips.groups.length > 0) &&
                allData.tips.groups[0].hasOwnProperty('items') &&
                (allData.tips.groups[0].items.length > 0) &&
                allData.tips.groups[0].items[0].hasOwnProperty('text')) ? allData.tips.groups[0].items[0].text : ''),
              menuUrl: (allData.hasOwnProperty('menu') && allData.menu.hasOwnProperty('url')) ? allData.menu.url : '',
              menuMobileUrl: (allData.hasOwnProperty('menu') && allData.menu.hasOwnProperty('mobileUrl')) ? allData.menu.mobileUrl : '',
              price: (allData.hasOwnProperty('price') && allData.price.hasOwnProperty('message')) ? allData.price.message : '',
              description: allData.hasOwnProperty('description') ? allData.description : '',
              likesCount: (allData.hasOwnProperty('likes') && allData.likes.hasOwnProperty('count')) ? allData.likes.count : -1,
              location: ((allData.hasOwnProperty('location') && allData.location.hasOwnProperty('address')) ? allData.location.address : ''),
              infoLoaded: true,
            })
          })
      })
      .catch((error) => {
        this.setState({
          infoLoaded: false,
        })
        console.log("Error: ", error)
      })
  }

  backToSearch = () => {
    this.props.setClicked(false)
    this.props.resetFilteredPlaces()
  }

  getDescription = () => (
    <ListItem primaryText={<div>Description: {this.state.description}</div>}/>
  )

  getAddress = () => (
    <ListItem>
      {!this.state.location && <div>Address: {this.state.address}</div>}
      {this.state.formattedAddress && <div>Location: {this.state.formattedAddress}</div>}
      {this.state.location && !this.state.address && !this.state.formattedAddress &&
      <div>Location: {this.state.location}</div>}
    </ListItem>
  )

  getCoordinates = () => (
    <ListItem>Coordinates: ({this.state.coordinates[0]}, {this.state.coordinates[1]})</ListItem>
  )

  getCategories = () => (
    <ListItem>
      Categories:
      {this.state.categories.map((category) => (<div key={category.id}>{category.name}</div>))}
    </ListItem>
  )

  getContact = () => (
    <ListItem>
      Contact:
      {this.state.phoneContact && <div>Phone: {this.state.phoneContact}</div>}
      {this.state.twitterContact && <div>Twitter: {this.state.twitterContact}</div>}
      {this.state.facebookContact && <div>Facebook: {this.state.facebookContact}</div>}
    </ListItem>
  )

  getUrl = () => (
    <ListItem tabIndex={0}>
      Website: <a href={this.state.url} target="_blank" rel="noopener noreferrer">{this.props.currentPlace}</a>
    </ListItem>
  )

  getStatus = () => (
    <ListItem>Current Status: {this.state.openStatus}</ListItem>
  )

  getSchedule = () => {
    // a reducer for formatting the contents of the queried scheduling array
    let reducer = (accumulator, currentValue) => (accumulator + ', ' + currentValue.renderedTime)
    return (
      <ListItem>
        Schedule:
        {this.state.timeFrames.map((time) => {
          let dayString = time.open.reduce(reducer, '').substring(2)
          if (time.hasOwnProperty('includesToday') && time.includesToday) {
            return ( <div key={time.days}><b>{time.days}: {dayString}</b></div> )
          } else {
            return ( <div key={time.days}>{time.days}: {dayString}</div> )
          }
        })}
      </ListItem>
    )
  }
}
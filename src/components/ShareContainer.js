import React from 'react';
import { connect } from 'react-redux';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  WhatsappShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
} from 'react-share';
import agent from '../agent';
import { ADD_SHARE } from '../constants/actionTypes';
import { ROOT_URL } from '../constants/settings';

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  share: (slug, sharetype) => dispatch({
    type: ADD_SHARE,
    payload: agent.Shares.create(slug, { sharetype })
  }),
});

const shareContainerStyles = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', flex: 1, justifyContent: 'center', margin: '20px'}
const shareButtonStyles = { margin:'0px 4px' }
const shareButtonSize = 32

class ShareContainer extends React.Component {

  beforeOnClick = sharetype => {
    const {article : { slug }, share} = this.props
    share(slug, sharetype)
  }

  render() {
    const { pathname, article } = this.props
    const { title, description, author: { username }} = article
    const slogan = `Hey! Schau dir mal den Artikel "${title}" von ${username} an!`
    const via = 'Conduit Example App Share Extension'
    const url = `${ROOT_URL}${pathname}`
    return (
      <div style={shareContainerStyles}>
        <FacebookShareButton
          url={url}
          style={shareButtonStyles}
          beforeOnClick={() => this.beforeOnClick('FACEBOOK')}
          quote={slogan}
        >
          <FacebookIcon size={shareButtonSize} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={url}
          style={shareButtonStyles}
          beforeOnClick={() => this.beforeOnClick('TWITTER')}
          title={slogan}
          via={via}
        >
          <TwitterIcon size={shareButtonSize} round />
        </TwitterShareButton>

        <LinkedinShareButton
          url={url}
          style={shareButtonStyles}
          beforeOnClick={() => this.beforeOnClick('LINKEDIN')}
          title={slogan}
          description={description}
        >
          <LinkedinIcon size={shareButtonSize} round />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={url}
          style={shareButtonStyles}
          beforeOnClick={() => this.beforeOnClick('WHATSAPP')}
          title={slogan}
        >
          <WhatsappIcon size={shareButtonSize} round />
        </WhatsappShareButton>

        <EmailShareButton
          url={url}
          style={shareButtonStyles}
          beforeOnClick={() => this.beforeOnClick('EMAIL')}
          subject={slogan}
          body={`${slogan} \n \n ${description} \n \n ${url}`}
        >
          <EmailIcon size={shareButtonSize} round />
        </EmailShareButton>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareContainer);

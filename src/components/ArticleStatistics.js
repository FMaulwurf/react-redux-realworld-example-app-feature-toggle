import React from 'react';
import { connect } from 'react-redux';
import { ARTICLE_STATISTICS_PAGE_LOADED, ARTICLE_PAGE_UNLOADED } from '../constants/actionTypes';
import agent from '../agent';
import ShareDots from './ShareDots';

import featureAwareFactoryBasedOn from '../features/featureAwareFactory';
import createFeatureDecisions from '../features/featureDecisions';

const mapStateToProps = state => ({
  ...state.article,
  currentUser: state.common.currentUser,
  features: state.features.active
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: ARTICLE_STATISTICS_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: ARTICLE_PAGE_UNLOADED })
});

class ArticleStatistics extends React.Component {

  componentWillMount() {
    featureAwareFactoryBasedOn(
      createFeatureDecisions(this.props.features).includeArticleStatisticsFeature()
    ).allowedToCallFunction(this.onLoad)
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  onLoad = () => {
    this.props.onLoad(Promise.all([
      agent.Articles.get(this.props.match.params.id),
      agent.Shares.forArticle(this.props.match.params.id)
    ]))
  }

  render() {
    const { shares } = this.props
    return featureAwareFactoryBasedOn(
            createFeatureDecisions(this.props.features).includeArticleStatisticsFeature()
          ).allowedToReturnComponent(
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px'}}>
              <ShareDots shares={shares}/>
            </div>
          )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleStatistics);

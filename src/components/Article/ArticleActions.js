import { Link } from 'react-router-dom';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_ARTICLE } from '../../constants/actionTypes';

import featureAwareFactoryBasedOn from '../../features/featureAwareFactory';
import createFeatureDecisions from '../../features/featureDecisions';

const mapDispatchToProps = dispatch => ({
  onClickDelete: payload =>
    dispatch({ type: DELETE_ARTICLE, payload })
});


const mapStateToProps = state => ({
  features: state.features.active
});

const ArticleActions = props => {
  const article = props.article;
  const del = () => {
    props.onClickDelete(agent.Articles.del(article.slug))
  };
  if (props.canModify) {
    return (
      <span>

        <Link
          to={`/editor/${article.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>

        {
          featureAwareFactoryBasedOn(
            createFeatureDecisions(props.features).includeArticleStatisticsFeature()
          ).allowedToReturnComponent(
            <Link
              to={`/article/${article.slug}/statistics`}
              className="btn btn-outline-secondary btn-sm">
              <i className="ion-podium"></i> Statistics
            </Link>
          )
        }

        <button className="btn btn-outline-danger btn-sm" onClick={del}>
          <i className="ion-trash-a"></i> Delete Article
        </button>

      </span>
    );
  }

  return (
    <span>
    </span>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleActions);

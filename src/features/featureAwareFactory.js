const featureAwareFactoryBasedOn = (featureDecision) => {
  return {
    allowedToReturnComponent(component){
      if( featureDecision ){
        return component;
      }else{
        return null;
      }
    },
    allowedToCallFunction(callback){
      if( featureDecision ){
        return callback();
      }
    }
  };
}

export default featureAwareFactoryBasedOn
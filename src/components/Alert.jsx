import { ReactPropTypes } from 'react';

export const Alert = (props) => {
  const { alertMsg, isError } = props;
  // Alert.propTypes = {
  //   alertMsg: ReactPropTypes.string,
  //   isError: ReactPropTypes.bool,
  // };
  return (
    <div
      className={`alert  text-small form-alert ${
        isError ? 'alert-danger' : 'alert-success'
      }`}
    >
      {alertMsg}
    </div>
  );
};

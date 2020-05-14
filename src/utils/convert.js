import moment from 'moment';

export const beforeSearchSubmit = params => {
    if(params.createdAt !== undefined) {
      params.createdAt = [
        moment(params.createdAt[0]).format('YYYY-MM-DD'), 
        moment(params.createdAt[1]).format('YYYY-MM-DD')
      ];
    }
    if(params.updatedAt !== undefined) {
      params.updatedAt = [
        moment(params.updatedAt[0]).format('YYYY-MM-DD'), 
        moment(params.updatedAt[1]).format('YYYY-MM-DD')
      ];
    }
    // console.log('search params: ', params);
    return params;
  }
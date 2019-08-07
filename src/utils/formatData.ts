import moment from 'moment';

export function formatPostData(postData: any[]): any[] {

    for (let data of postData) {
        for (let key in data) {
            switch (key) {
                case "ctime":
                case "b_time":
                case "e_time":
                case "s_time":
                    if (data[key]) {
                        data[key] = moment(data[key]).format("YYYY-MM-DD HH:mm:ss");
                    }


                    break;


            }
        }
    }
    return postData;

}
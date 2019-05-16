import React from "react";

class Properties extends React.Component {

    static DcafEncoding =  Object.freeze({
        "SAM": "0",
        "SAI": "1",
        "CAI": "2",
        "E": "3",
        "K": "4",
        "TS": "5",
        "L": "6",
        "G": "7",
        "F": "8",
        "V": "9",
        "A": "10",
        "D": "11",
        "N": "12",
    });

    static Methods =  Object.freeze({
        "GET": 1,
        "POST": 2,
        "PUT": 4,
        "DELETE": 8,
        "PATCH": 16
    });
}

export default Properties
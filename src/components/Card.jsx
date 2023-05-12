import React from "react";

const Card = ({ char }) => {

    return (
        <>
            <div className="" style={{ background: "transparent" }}>
                <div
                    className="card"
                    style={{
                        height: "100px",
                        width: "100px",
                        background: "transparent",
                    }}
                >
                    <div
                        style={{
                            fontSize: "50px",
                            background: "rgba(0,0,25,0.1)",
                        }}
                        className="card-body d-flex h-100 justify-content-center align-items-center"
                    >
                        {char}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Card;

import Layout from '../Layout/Layout';

function ConversationList(props) {

    const { conversations } = props;

    return (
        <React.Fragment>
            <Layout main={false}>
                <br />
                <div className="inbox-container">
                    <h1 className="inbox-heading">Conversations</h1>
                    <div>{conversations}</div>
                </div>
                <br />
            </Layout>

            <style jsx>{`
                .inbox-container {
                    width: 75%;
                    margin-top: 2em;
                    transform: translate(-50%);
                    margin-left: 50%;
                    background: white;
                    padding: 1em;
                    padding-top: 0.5em;
                    border-radius: 15px;
                    border-bottom-style: groove;
                }

                .inbox-heading {
                    margin-bottom: 0.5em;
                }
            `}</style>
        </React.Fragment>
    );
}

export default ConversationList;
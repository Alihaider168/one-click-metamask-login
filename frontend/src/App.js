import { useState, useCallback, useMemo } from "react";
import "bulma/css/bulma.min.css";
import {
  Container,
  Heading,
  Content,
  Button,
  Image,
} from "react-bulma-components";
import Hero from "react-bulma-components/esm/components/hero";
import Footer from "react-bulma-components/cjs/components/footer";
import logo from "./metamask.svg";
import Web3 from "web3";
import Modal from "./Modal";
import { detect } from "detect-browser";
import { messages } from "./Utils";
import { getNonce, login, logout } from "./AuthService";
import { isMobile } from "react-device-detect";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [userLogged, setUserLogged] = useState(false);
  const [fieldsModal, setFieldsModal] = useState(undefined);

  let web3 = new Web3(Web3.givenProvider);

  const hasMetamask = useCallback(() => {
    const provider = web3.currentProvider;
    if (
      provider &&
      provider === window.ethereum &&
      window.ethereum.isMetaMask
    ) {
      console.log("MetaMask is installed!");
      return true;
    } else {
      return false;
    }
  }, [web3.currentProvider]);

  const isSupportedBroswer = () => {
    const browser = detect().name;
    switch (browser) {
      case "safari":
        return false;
      default:
        return true;
    }
  };

  const handlerClikLogout = () => {
    setIsLoading(true);
    setUserLogged(false);
    setEthAddress("");
    setFieldsModal(undefined);
    logout({ address: ethAddress }).then(setIsLoading(false));
  };
  const handlerClikLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      if (hasMetamask()) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        //const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setEthAddress(account);
        getNonce({ address: account })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              const { nonce, welcomeMsg } = res.data;
              const msg = `${welcomeMsg}${nonce}`;
              web3.eth.personal
                .sign(web3.utils.utf8ToHex(msg), account)
                .then((res) => login({ res, nonce, msg }))
                .then((res) => {
                  setIsLoading(false);
                  if (res.status === 200) {
                    setFieldsModal({
                      success: "true",
                      danger: "false",
                      title: messages.LOGIN_SUCCESS_TITLE,
                      body: res.data.message,
                      show: "true",
                      btnType: "success",
                    });
                    setUserLogged(true);
                  }
                })
                .catch((err) => {
                  setIsLoading(false);

                  setFieldsModal({
                    success: "false",
                    danger: "true",
                    title: messages.NO_VALID_SIGN_TITLE,
                    body: err.response
                      ? err.response.data.message
                      : err.message,
                    show: "true",
                    btnType: "danger",
                  });
                });
            }
          })
          .then()
          .catch((err) => {
            console.log(err.response);
            setIsLoading(false);
            setFieldsModal({
              success: "false",
              danger: "true",
              title: messages.NO_VALID_ADDRESS_TITLE,
              body: err.response.data.message,
              show: "true",
              btnType: "danger",
            });
          });

        // equivalente di web3.eth.personal.sign
        // web3.eth.personal.sign chiama questa fx
        // window.ethereum.sendAsync(
        //   {
        //     method: 'personal_sign',
        //     params: [web3.utils.utf8ToHex('Hello world'), accounts[0]],
        //     from: accounts[0]
        //   },
        //   (_err, { result }) => (_err ? console.error(_err) : console.log(result))
        // )
      } else {
        setIsLoading(false);
        setFieldsModal({
          success: "false",
          danger: "true",
          title: messages.METAMASK_NOT_FOUNDED,
          body: isMobile
            ? messages.DEVICE_NOT_SUPPORTED
            : isSupportedBroswer()
            ? messages.INSTALL_METAMASK_BODY
            : messages.METAMASK_NOT_SUPPORTED_BODY,
          show: "true",
          btnType: "danger",
        });
      }
    },
    [hasMetamask, web3.utils, web3.eth]
  );

  return (
    <div>
      {fieldsModal !== undefined && (
        <Modal setFieldsModal={setFieldsModal} fieldsModal={fieldsModal} />
      )}
      <Hero size="fullheight">
        <Hero.Header backgroundColor="primary">
          <Container
            my={5}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={logo} size={128} />
            <Heading textColor={"white"}>Connect Wallet and Chat</Heading>
            <Heading textColor="grey" subtitle size={3}>
      
            </Heading>
          </Container>
        </Hero.Header>
        <Hero.Body>
          <Container
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            {userLogged === false ? (
              <Content>
                <Button
                  size="medium"
                  loading={isLoading}
                  rounded="true"
                  fullwidth="true"
                  color="warning"
                  onClick={handlerClikLogin}
                >
                  Login with MetaMask
                </Button>
              </Content>
            ) : (
              <Content
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
              >
                <Heading>Congratulation {ethAddress}</Heading>
                <Heading textColor="grey" subtitle size={3}>
                  You are logged correctly with MetaMask
                </Heading>
                <Button
                  size="medium"
                  loading={isLoading}
                  rounded="true"
                  fullwidth="true"
                  color="white-ter"
                  onClick={handlerClikLogout}
                  style={{ width: 250 }}
                >
                  Logout
                </Button>
              </Content>
            )}
          </Container>
        </Hero.Body>
        <Hero.Footer>
          <Footer>
          
          </Footer>
        </Hero.Footer>
      </Hero>
    </div>
  );
}

export default App;

import React from "react";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import Iframe from 'react-iframe';

const EmbedPage = () => {
  return (
    <MainContainer>
      <MainHeader>
        <Title>Embedded Content</Title>
      </MainHeader>
      <Iframe
        url="https://www.google.com.br"
        width="100%"
        height="600px"
        id="myIframe"
        className="myClassname"
        display="initial"
        position="relative"
      />
    </MainContainer>
  );
};

export default EmbedPage;

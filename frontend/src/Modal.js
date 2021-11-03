import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import "bulma/css/bulma.min.css";
import { Content, Button } from "react-bulma-components";

function Modal({ fieldsModal, setFieldsModal }) {
  console.log(fieldsModal);
  const { show } = fieldsModal;
  const [showModal, setShowModal] = useState(show);

  const handlerClick = (e) => {
    e.preventDefault();
    setShowModal("false");
    setFieldsModal(undefined);
  };

  return (
    <div>
      <SweetAlert
        show={showModal === "true" ? true : false}
        success={fieldsModal.success === "true" ? true : false}
        danger={fieldsModal.danger === "true" ? true : false}
        title={fieldsModal.title}
        showConfirm={false}
        onConfirm={() => {}}
      >
        <Content>
          <p><b>{fieldsModal.body}</b></p>
          <Button
            onClick={handlerClick}
            fullwidth={true}
            color={fieldsModal.btnType}
          >
            OK
          </Button>
        </Content>
      </SweetAlert>
    </div>
  );
}

export default Modal;

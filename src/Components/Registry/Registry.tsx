import React, { Component } from "react";
import { Row, Col, Layout, Select } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { SimpleCard } from "../DefaultComponents/Card";
import { SimpleInput } from "../DefaultComponents/Input";
import { SimpleButton } from "../DefaultComponents/Button";
import { Domain, periodUnit, verifiedProvider } from "../../models/Domain";
import { verifiedProvidersList } from "../../Constants/verifiedProviders";
import { operations } from "../../Constants/domainOperations";
import moment from "moment";
const { Content } = Layout;
const { Option } = Select;

type domainOperation = "registration" | "renewal" | "deletion" | "info";

class RegistryVM {
  @observable registeredDomains: Domain[] = [];
  @observable domain: Domain = new Domain();
  @observable operation: domainOperation = "registration";
  @observable domainNameError: string = "";
  @observable domainPeriodError: string = "";
  @observable domainContactIDError: string = "";
  @observable displayResponse: boolean = false;
  @observable domainName: string = "";
  @observable domainExpiration: string = "";
  @observable status: string = '';

  handlePeriodChange = (value: periodUnit) => {
    this.clearResponse();
    this.domain.period.unit = value;
  };

  handleProviderChange = (value: verifiedProvider) => {
    this.clearResponse();
    this.domain.contact.provider = value;
  };

  handleOperationChange = (value: domainOperation) => {
    this.clearResponse();
    this.status = '';
    this.domain = new Domain();
    this.operation = value;
  };

  handleSubmit = () => {
    if (this.operation === "registration") {
      if (this.domain.name.length < 10) {
        this.domainNameError =
          "Domain name must be at least 10 characters long";
      }
      if (this.domain.period.value < 1) {
        this.domainPeriodError = "Period value must be at least 1 year";
      }
      if (!this.domain.contact.id) {
        this.domainContactIDError = "Contact ID cannot be empty";
      }
      if(this.domain.contact.id && this.domain.contact.id !== this.domain.contact.provider.slice(-3)){
        this.domainContactIDError = "Incorrect ID"
      }
      if (
        this.domainNameError ||
        this.domainPeriodError ||
        this.domainContactIDError
      ) {
        return;
      }
      if(this.registeredDomains.find(domain => domain.name === this.domain.name)){
        this.status = 'This domain name has already been registered. Please try a different one'
        return
      }
      this.registeredDomains.push(
        new Domain(
          this.domain.name,
          moment(),
          this.domain.period,
          this.domain.contact
        )
      );
      this.domainName = this.domain.name;
      this.domainExpiration = moment()
        .add(this.domain.period.value, "years")
        .format("MMMM Do YYYY");
      this.displayResponse = true;
    }
    if (this.operation === "renewal") {
      if(!this.registeredDomains.find(domain => domain.name === this.domain.name)){
        this.status = 'This domain name is not registered. Please register it before renewing the domain.'
        return
      }
      this.status=''
      this.registeredDomains.forEach(domain => {
        if (domain.name === this.domain.name) {
          domain.registeredDate = moment().add(domain.period.value, "years");
          domain.period.value = this.domain.period.value;
          this.displayResponse = true;
          this.domainName = domain.name;
          this.domainExpiration = domain.registeredDate
            .add(this.domain.period.value, "years")
            .format("MMMM Do YYYY");
        }
      });
    }
    if (this.operation === "info") {
      if(!this.registeredDomains.find(domain => domain.name === this.domain.name)){
        this.status = 'This domain name is not registered.'
        return
      }
      this.status=''
      this.registeredDomains.forEach(domain => {
        if (domain.name === this.domain.name) {
          this.displayResponse = true;
          this.domainName = domain.name;
          this.domainExpiration = domain.registeredDate
            .add(domain.period.value, "years")
            .format("MMMM Do YYYY");
        }
      });
    }
    if (this.operation === "deletion") {
      if(!this.registeredDomains.find(domain => domain.name === this.domain.name)){
        this.status = 'This domain name is not registered or is no longer registered.'
        return
      }
      const index = this.registeredDomains.findIndex(
        domain => domain.name === this.domain.name
      );
      if (index !== -1) {
        this.registeredDomains.splice(index, 1);
        this.status = 'Successfully deleted domain';
      }
    }
  };

  clearResponse = () => {
    this.displayResponse = false;
    this.domainName = "";
    this.domainExpiration = "";
  };
}

@observer
export default class Registry extends Component {
  vm = new RegistryVM();

  render() {
    return (
      <Layout>
        <Content>
          <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col xs={23}>
              <Row justify="center" align="middle">
                <Col xs={23} sm={16}>
                  <SimpleCard>
                    <Row justify="center" style={{ marginBottom: "20px" }}>
                      <Col span={24}>
                        <h2>Domain Name Registration</h2>
                        <h4>Domain Operation</h4>
                        <Select
                          defaultValue="registration"
                          style={{
                            width: "90%",
                            borderRadius: "5px"
                          }}
                          showArrow={false}
                          onChange={this.vm.handleOperationChange}
                        >
                          {operations.map(operation => {
                            return (
                              <Option key={operation} value={operation}>
                                {operation}
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                    {this.vm.operation === "renewal" && (
                      <>
                        <Row justify="center">
                          <Col span={24}>
                            <SimpleInput
                              title="Domain Name"
                              placeholder="Domain Name"
                              changed={event => {
                                this.vm.clearResponse();
                                this.vm.domainNameError = "";
                                this.vm.domain.name = event.target.value;
                              }}
                            />
                            {this.vm.domainNameError && (
                              <h5 style={{ color: "red" }}>
                                {this.vm.domainNameError}
                              </h5>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <SimpleInput
                              title="Period"
                              placeholder="Number of Years"
                              changed={event => {
                                this.vm.clearResponse();
                                this.vm.domainPeriodError = "";
                                this.vm.domain.period.value = Number(
                                  event.target.value
                                );
                              }}
                            />
                          </Col>
                          <Col span={12}>
                            <Row justify="end">
                              <Select
                                defaultValue="year"
                                style={{
                                  paddingTop: "30px",
                                  width: "90%",
                                  borderRadius: "5px"
                                }}
                                showArrow={false}
                                onChange={this.vm.handlePeriodChange}
                              >
                                <Option value="year">year</Option>
                              </Select>
                            </Row>
                          </Col>
                          {this.vm.domainPeriodError && (
                            <h5 style={{ color: "red" }}>
                              {this.vm.domainPeriodError}
                            </h5>
                          )}
                        </Row>
                      </>
                    )}
                    {this.vm.operation === "registration" && (
                      <>
                        <Row justify="center">
                          <Col span={24}>
                            <SimpleInput
                              title="Domain Name"
                              placeholder="Domain Name"
                              changed={event => {
                                this.vm.clearResponse();
                                this.vm.domainNameError = "";
                                this.vm.domain.name = event.target.value;
                              }}
                            />
                            {this.vm.domainNameError && (
                              <h5 style={{ color: "red" }}>
                                {this.vm.domainNameError}
                              </h5>
                            )}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={12}>
                            <SimpleInput
                              title="Period"
                              placeholder="Number of Years"
                              changed={event => {
                                this.vm.clearResponse();
                                this.vm.domainPeriodError = "";
                                this.vm.domain.period.value = Number(
                                  event.target.value
                                );
                              }}
                            />
                          </Col>
                          <Col span={12}>
                            <Row justify="end">
                              <Select
                                defaultValue="year"
                                style={{
                                  paddingTop: "30px",
                                  width: "90%",
                                  borderRadius: "5px"
                                }}
                                showArrow={false}
                                onChange={this.vm.handlePeriodChange}
                              >
                                <Option value="year">year</Option>
                              </Select>
                            </Row>
                          </Col>
                          {this.vm.domainPeriodError && (
                            <h5 style={{ color: "red" }}>
                              {this.vm.domainPeriodError}
                            </h5>
                          )}
                        </Row>
                        <Row justify="center">
                          <Col span={24}>
                            <h4>Verfied Contact Provider</h4>
                            <Select
                              defaultValue="provider-abc"
                              style={{ width: "100%", marginBottom: "15px" }}
                              showArrow={false}
                              onChange={this.vm.handleProviderChange}
                            >
                              {verifiedProvidersList.map(provider => {
                                return (
                                  <Option key={provider} value={provider}>
                                    {provider}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Col>
                        </Row>
                        <Row justify="center">
                          <Col span={24}>
                            <SimpleInput
                              title={`Verified Contact ID (Use '${this.vm.domain.contact.provider.slice(-3)}' as the id)`} 
                              placeholder="Verified Contact ID"
                              changed={event => {
                                this.vm.clearResponse();
                                this.vm.domainContactIDError = "";
                                this.vm.domain.contact.id = event.target.value;
                              }}
                            />
                            {this.vm.domainContactIDError && (
                              <h5 style={{ color: "red" }}>
                                {this.vm.domainContactIDError}
                              </h5>
                            )}
                          </Col>
                        </Row>
                      </>
                    )}
                    {this.vm.operation === "deletion" && (
                      <Row justify="center">
                        <Col span={24}>
                          <SimpleInput
                            title="Domain Name"
                            placeholder="Domain Name"
                            changed={event => {
                              this.vm.clearResponse();
                              this.vm.domain.name = event.target.value;
                            }}
                          />
                        </Col>
                      </Row>
                    )}
                    {this.vm.operation === "info" && (
                      <Row justify="center">
                        <Col span={24}>
                          <SimpleInput
                            title="Domain Name"
                            placeholder="Domain Name"
                            changed={event => {
                              this.vm.clearResponse();
                              this.vm.domain.name = event.target.value;
                            }}
                          />
                        </Col>
                      </Row>
                    )}
                    <Row justify="center" style={{ marginBottom: "20px" }}>
                      <SimpleButton onClick={this.vm.handleSubmit}>
                        Submit
                      </SimpleButton>
                    </Row>
                    <Row justify="center">
                      {this.vm.displayResponse && (
                        <h4>
                          Domain Name: {this.vm.domainName}, Domain Expiration:{" "}
                          {this.vm.domainExpiration}
                        </h4>
                      )}
                      {this.vm.status && (
                        <h4>{this.vm.status}</h4>
                      )}
                    </Row>
                  </SimpleCard>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}

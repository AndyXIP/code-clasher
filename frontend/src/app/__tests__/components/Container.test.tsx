import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Container, ContainerOuter, ContainerInner } from "../../components/Container";

describe("Container Components", () => {
  test("ContainerOuter renders children and applies className", () => {
    render(
      <ContainerOuter className="test-class" data-testid="container-outer">
        <div data-testid="child">Child Content</div>
      </ContainerOuter>
    );

    const outerContainer = screen.getByTestId("container-outer");
    expect(outerContainer).toBeInTheDocument();
    expect(outerContainer).toHaveClass("test-class");
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("ContainerInner renders children and applies className", () => {
    render(
      <ContainerInner className="inner-class" data-testid="container-inner">
        <p data-testid="inner-child">Inner Content</p>
      </ContainerInner>
    );

    const innerContainer = screen.getByTestId("container-inner");
    expect(innerContainer).toBeInTheDocument();
    expect(innerContainer).toHaveClass("inner-class");
    expect(screen.getByTestId("inner-child")).toHaveTextContent("Inner Content");
  });

  test("Container renders correctly with nested components", () => {
    render(
      <Container data-testid="main-container">
        <span data-testid="container-child">Main Content</span>
      </Container>
    );

    expect(screen.getByTestId("main-container")).toBeInTheDocument();
    expect(screen.getByTestId("container-child")).toHaveTextContent("Main Content");
  });

  test("ContainerOuter renders additional props", () => {
    render(
      <ContainerOuter className="extra-class" id="custom-id" data-testid="container-outer">
        <span>Test</span>
      </ContainerOuter>
    );

    const outerContainer = screen.getByTestId("container-outer");
    expect(outerContainer).toHaveAttribute("id", "custom-id");
    expect(outerContainer).toHaveClass("extra-class");
  });

  test("ContainerInner renders additional props", () => {
    render(
      <ContainerInner className="another-class" data-testid="container-inner">
        <span>Inner Test</span>
      </ContainerInner>
    );

    const innerContainer = screen.getByTestId("container-inner");
    expect(innerContainer).toHaveClass("another-class");
  });
});
describe("utils/mailer", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("logs when not configured in dev", async () => {
    jest.doMock("../../config", () => ({
      IS_PRODUCTION: false,
      MAIL_HOST: "",
      MAIL_PORT: 587,
      MAIL_USER: "",
      MAIL_PASS: "",
      MAIL_FROM: "",
      MAIL_SECURE: false
    }), { virtual: true });
    jest.doMock("nodemailer", () => ({ createTransport: jest.fn() }));
    const nodemailer = require("nodemailer");
    const { sendPasswordResetEmail } = require("../../utils/mailer");
    await expect(sendPasswordResetEmail("user@test.com", "link")).resolves.not.toThrow();
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  test("sends when configured", async () => {
    const sendMail = jest.fn();
    jest.doMock("../../config", () => ({
      IS_PRODUCTION: false,
      MAIL_HOST: "smtp.test",
      MAIL_PORT: 587,
      MAIL_USER: "user",
      MAIL_PASS: "pass",
      MAIL_FROM: "from@test.com",
      MAIL_SECURE: false
    }), { virtual: true });
    jest.doMock("nodemailer", () => ({ createTransport: jest.fn(() => ({ sendMail })) }));
    const { sendPasswordResetEmail } = require("../../utils/mailer");
    await sendPasswordResetEmail("user@test.com", "link");
    expect(sendMail).toHaveBeenCalled();
  });

  test("throws in production without config", async () => {
    jest.doMock("../../config", () => ({
      IS_PRODUCTION: true,
      MAIL_HOST: "",
      MAIL_PORT: 587,
      MAIL_USER: "",
      MAIL_PASS: "",
      MAIL_FROM: "",
      MAIL_SECURE: false
    }), { virtual: true });
    jest.doMock("nodemailer", () => ({ createTransport: jest.fn() }));
    const { sendPasswordResetEmail } = require("../../utils/mailer");
    await expect(sendPasswordResetEmail("user@test.com", "link")).rejects.toThrow(/mailer is not configured/i);
  });

  test("reuses transporter", async () => {
    const sendMail = jest.fn();
    const createTransport = jest.fn(() => ({ sendMail }));
    jest.doMock("../../config", () => ({
      IS_PRODUCTION: false,
      MAIL_HOST: "smtp.test",
      MAIL_PORT: 587,
      MAIL_USER: "user",
      MAIL_PASS: "pass",
      MAIL_FROM: "from@test.com",
      MAIL_SECURE: false
    }), { virtual: true });
    jest.doMock("nodemailer", () => ({ createTransport }));
    const { sendPasswordResetEmail } = require("../../utils/mailer");
    await sendPasswordResetEmail("user@test.com", "link");
    await sendPasswordResetEmail("user@test.com", "link");
    expect(createTransport).toHaveBeenCalledTimes(1);
  });
});

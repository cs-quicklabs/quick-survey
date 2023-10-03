require "application_system_test_case"
require "nokogiri"

class OnboardingTest < ApplicationSystemTestCase
  include ActionMailer::TestHelper

  test "admin can login" do
    admin = users(:admin)
    visit new_user_session_path
    fill_in "user_email", with: admin.email
    fill_in "user_password", with: "password"
    click_on "Log In"
    assert_current_path(dashboard_path(script_name: "/#{admin.account.id}"))
    take_screenshot
  end

  test "member can login" do
    member = users(:member)
    visit new_user_session_path
    fill_in "user_email", with: member.email
    fill_in "user_password", with: "password"
    click_on "Log In"

    assert_current_path(dashboard_path(script_name: "/#{member.account.id}"))
    take_screenshot
  end

  test "super admin can login" do
    super_admin = users(:super_admin)
    visit new_user_session_path
    fill_in "user_email", with: super_admin.email
    fill_in "user_password", with: "password"
    click_on "Log In"
    assert_current_path(dashboard_path(script_name: "/#{super_admin.account.id}"))
    take_screenshot
  end

  test "user can send forgotten password email" do
    admin = users(:member)
    visit new_user_session_path
    click_on "Forgot your password?"
    fill_in "user_email", with: admin.email

    assert_emails 1 do
      click_on "Send me reset password instructions"
      sleep(0.5)
    end
    assert_selector "p.notice", text: "You will receive an email with instructions on how to reset your password in a few minutes."
    doc = Nokogiri::HTML::Document.parse(ActionMailer::Base.deliveries.last.body.to_s)
    link = doc.css("a").first.values.first
    visit link
    fill_in "user_password", with: "password"
    fill_in "user_password_confirmation", with: "password"
    click_on "Change my password"
    assert_selector "p.notice", text: "Your password has been changed successfully."
    take_screenshot
  end

  test "admin can invite a new user" do
    admin = users(:admin)
    sign_in admin
    visit users_path(script_name: "/#{admin.account.id}")
    click_on "Invite New User"
    fill_in "user_email", with: "new_user@crownstack.com"
    assert_emails 1 do
      click_on "Send an invitation"
      sleep(0.5)
    end
    assert_text "User has been invited."
    sign_out admin
    doc = Nokogiri::HTML::Document.parse(ActionMailer::Base.deliveries.last.to_s)
    link = doc.css("a").first.values.first
    visit link
    fill_in "user_password", with: "password"
    fill_in "user_password_confirmation", with: "password"
    click_on "Set password and login"
    assert_selector "p.notice", text: "Your password was set successfully. You are now signed in."
  end

  test "email invite can be sent to a any user who has not accepted the invite" do
    admin = users(:admin)
    sign_in admin
    visit users_path(script_name: "/#{admin.account.id}")
    invited = users(:invited)
    within("tr", id: dom_id(invited)) do
      assert_emails 1 do
        within("td", class: "actions") do
          find("a", text: "Resend Invitation").click
        end
        sleep(0.5)
      end
    end
    sign_out admin
    doc = Nokogiri::HTML::Document.parse(ActionMailer::Base.deliveries.last.to_s)
    link = doc.css("a").first.values.first
    visit link
    fill_in "user_password", with: "password"
    fill_in "user_password_confirmation", with: "password"
    click_on "Set password and login"
    assert_selector "p.notice", text: "Your password was set successfully. You are now signed in."
  end

  test "user can signup" do
    visit new_user_registration_path
    fill_in "user_first_name", with: "Aashish"
    fill_in "user_last_name", with: "Dhawan"
    fill_in "user_email", with: "awesome@crownstack.com"
    fill_in "user_company", with: "Crownstack Technologies"
    fill_in "user_new_password", with: "Awesome@2021!"
    fill_in "user_new_password_confirmation", with: "Awesome@2021!"
    assert_emails 1 do
      within("form") do
        click_on "Sign up"
      end
      sleep(1.0)
    end

    take_screenshot
    assert_selector "p.notice", text: "A message with a confirmation link has been sent to your email address. Please follow the link to activate your account."
    doc = Nokogiri::HTML::Document.parse(ActionMailer::Base.deliveries.last.to_s)
    link = doc.css("a").first.values.first
    visit link
    assert_selector "p.notice", text: "Your email address has been successfully confirmed."
    fill_in "user_email", with: "awesome@crownstack.com"
    fill_in "user_password", with: "Awesome@2021!"
    click_on "Log In"
    assert_selector "p.notice", text: "Signed in successfully."
  end

  test "user can not signup with invalid params" do
    visit new_user_registration_path
    within("form") do
      click_on "Sign up"
    end
    assert_selector "div#error_explanation", text: "First name can't be blank"
    assert_selector "div#error_explanation", text: "Last name can't be blank"
    assert_selector "div#error_explanation", text: "Email can't be blank"
    assert_selector "div#error_explanation", text: "Company can't be blank"
    assert_selector "div#error_explanation", text: "New password can't be blank"
    assert_selector "div#error_explanation", text: "New password confirmation can't be blank"
  end

  test "user can not signup with duplicate email" do
    visit new_user_registration_path
    fill_in "user_email", with: users(:admin).email
    within("form") do
      click_on "Sign up"
    end
    assert_selector "div#error_explanation", text: "Email has already been taken"
  end

  test "user can confirm email" do
    visit new_user_session_path
    click_on "Didn't receive email confirmation instructions?"
    fill_in "user_email", with: users(:unconfirmed).email
    assert_emails 1 do
      click_on "Resend confirmation instructions"
      sleep(0.5)
    end
    take_screenshot

    assert_selector "p.notice", text: "You will receive an email with instructions for how to confirm your email address in a few minutes."
    doc = Nokogiri::HTML::Document.parse(ActionMailer::Base.deliveries.last.to_s)
    link = doc.css("a").first.values.first
    visit link
    assert_selector "p.notice", text: "Your email address has been successfully confirmed."
  end
end

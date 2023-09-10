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
    assert_current_path(dashboard_path)
    take_screenshot
  end

  test "member can login" do
    member = users(:member)
    visit new_user_session_path
    fill_in "user_email", with: member.email
    fill_in "user_password", with: "password"
    click_on "Log In"

    assert_current_path(dashboard_path)
    take_screenshot
  end

  test "super admin can login" do
    super_admin = users(:super_admin)
    visit new_user_session_path
    fill_in "user_email", with: super_admin.email
    fill_in "user_password", with: "password"
    click_on "Log In"
    assert_current_path(dashboard_path)
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
    visit users_path
    visit users_path
    click_on "Invite New User"
    fill_in "user_email", with: "new_user@crownstack.com"
    assert_emails 1 do
      click_on "Send an invitation"
      sleep(0.5)
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

  test "email invite can be sent to a any user who has not accepted the invite" do
    admin = users(:admin)
    sign_in admin
    visit users_path
    invited = users(:invited)
    within("tr", id: dom_id(invited)) do
      assert_emails 1 do
        within("td", class: "status") do
          find("a", text: "Invite").click
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

  test "email invite can be sent to a any user who has not joined" do
    admin = users(:admin)
    sign_in admin
    visit users_path

    not_joined = users(:not_joined)

    within("tr", id: dom_id(not_joined)) do
      assert_emails 1 do
        within("td", class: "status") do
          click_on "Resend Invitation"
          sleep(0.5)
        end
      end
    end
    assert_selector "p.notice", text: "Invitation has been resent successfully."
    sign_out admin
    doc = Nokogiri::HTML::Document.parse(ActionMailer::Base.deliveries.last.to_s)
    link = doc.css("a").first.values.first
    visit link
    fill_in "user_password", with: "password"
    fill_in "user_password_confirmation", with: "password"
    click_on "Set password and login"
    assert_selector "p.notice", text: "Your password was set successfully. You are now signed in."
    sign_out not_joined
    sign_in admin
    visit users_path
    within("tr", id: dom_id(not_joined)) do
      within("td", class: "status") do
        assert_text "Joined"
      end
    end
  end
end

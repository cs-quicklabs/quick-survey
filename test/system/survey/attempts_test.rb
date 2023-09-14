require "application_system_test_case"

class AttemptsTest < ApplicationSystemTestCase
  setup do
    @user = users(:member)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @survey = survey_surveys(:one)
    @attempt = survey_attempts(:one)
    sign_in @user
  end

  def page_url
    survey_url(script_name: "/#{@account.id}", id: @survey.id)
  end

  test "can visit index page if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: @survey.name
    assert_selector "div#survey-tabs", text: "Attempts"
  end

  test "can not visit index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can attempt a survey and view the attempt" do
    visit page_url
    within "#survey-header" do
      click_on "Actions"
      click_on "Attempt"
    end
    fill_in "name", with: "Test Attempt"
    fill_in "email", with: "test_attempt@crownstack.com"
    click_on "Start"
    click_on "Preview and Submit"
    take_screenshot
    fill_in "comment", with: "This is a comment"
    click_on "Submit"
    sleep(0.2)
    visit page_url
    within "#survey-tabs" do
      click_link "Attempts"
    end
    attempt = @survey.attempts.last
    within "tr", id: dom_id(attempt) do
      assert_selector "td", text: attempt.participant.name
    end
  end
end

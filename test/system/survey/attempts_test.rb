require "application_system_test_case"

class AttemptsTest < ApplicationSystemTestCase
  setup do
    @user = users(:regular)
    @survey = survey_surveys(:user)
    @attempt = survey_attempts(:user)
    sign_in @user
  end

  def page_url
    survey_attempts_url(survey_id: @survey.id)
  end

  def attempt_url
    survey_attempt_url(survey_id: @survey.id, id: @attempt.id)
  end

  test "can visit index page if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: @survey.name
    assert_selector "div#survey-tabs", text: "Attempts"
    assert_selector "div#assignees"
  end

  test "can not visit index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can attempt a survey" do
    visit attempt_url
    sleep(5)
    click_on "Preview and Submit"
    take_screenshot
    fill_in "survey_attempt_comment", with: "This is a comment"
    click_on "Submit"
    sleep(0.2)
    visit page_url
    assert_selector "td", text: "Submitted"
    find(id: dom_id(@attempt)).click_link("View")
    take_screenshot
    assert_selector "h4", text: "This is a comment"
  end

  test "can view  attempt" do
    visit page_url
    take_screenshot
    @attempt = @survey.attempts.first
    if find("tr", id: dom_id(@attempt))
      find("tr", id: dom_id(@attempt)).click_link("View")
      assert_selector "h1", text: @survey.name
      assert_selector "p", text: "Participant"
      assert_selector "h3", text: "Score"
    end
    take_screenshot
  end

  test "can delete attempt" do
    visit page_url
    take_screenshot
    @attempt = @survey.attempts.first
    if find("tr", id: dom_id(@attempt))
      find("tr", id: dom_id(@attempt)).click_link("Delete")
      assert_no_selector dom_id(@attempt), text: @attempt.survey
    end
    take_screenshot
  end
end

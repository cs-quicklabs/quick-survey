require "application_system_test_case"

class AttemptsTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
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

  test "can attempt a checklist survey and view the attempt " do
    visit page_url
    within "#survey-header" do
      click_on "Actions"
      click_on "Attempt"
    end
    fill_in "name", with: "Test Attempt"
    fill_in "email", with: "test_attempt@crownstack.com"
    click_on "Start"
    option1 = @attempt.survey.questions.first.options.first
    option2 = @attempt.survey.questions.second.options.first
    find("input[type='checkbox']", id: dom_id(option1)).set(true)
    find("input[type='checkbox']", id: dom_id(option1)).set(false)
    find("input[type='checkbox']", id: dom_id(option2)).set(true)
    click_on "Preview and Submit"
    assert_selector "input[type='checkbox']", id: dom_id(option1), checked: false
    assert_selector "input[type='checkbox']", id: dom_id(option2), checked: true
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
  test "can attempt a score survey and view the attempt " do
    visit page_url
    within "#survey-header" do
      click_on "Actions"
      click_on "Attempt"
    end
    fill_in "name", with: "Test Attempt"
    fill_in "email", with: "test_attempt@crownstack.com"
    click_on "Start"
    question1 = @attempt.survey.questions.first
    question2 = @attempt.survey.questions.second
    question3 = @attempt.survey.questions.third
    question4 = @attempt.survey.questions.fourth
    within "tr##{dom_id(question1)}" do
      click_on "7"
    end
    within "tr##{dom_id(question3)}" do
      click_on "2"
    end
    within "tr##{dom_id(question4)}" do
      click_on "5"
    end
    click_on "Preview and Submit"
    within "tr##{dom_id(@attempt.survey.questions.first)}" do
      assert_selector "svg#tick"
    end
    within "tr##{dom_id(@attempt.survey.questions.second)}" do
      assert_selector "td", text: "0"
      assert_selector "svg#orange"
    end
    within "tr##{dom_id(@attempt.survey.questions.third)}" do
      assert_selector "td", text: "1"
      assert_selector "svg#cross"
    end
    within "tr##{dom_id(@attempt.survey.questions.fourth)}" do
      assert_selector "td", text: "4"
      assert_selector "svg#ok"
    end
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

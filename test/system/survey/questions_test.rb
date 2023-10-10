require "application_system_test_case"

class QuestionsTest < ApplicationSystemTestCase
  setup do
    @user = users(:admin)
    @account = @user.account
    ActsAsTenant.current_tenant = @account
    @survey = survey_surveys(:one)
    sign_in @user
  end

  def page_url
    survey_path(script_name: @account.id, id: @survey.id)
  end

  test "can show index if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: @survey.name
    assert_selector "div#survey-tabs", text: "Questions"
    assert_selector "form#new_survey_question"
  end

  test "can not show index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can add a new question" do
    visit page_url
    fill_in "survey_question_text", with: "This is a question"
    fill_in "survey_question_description", with: "This is a sample Question Description"
    click_on "Add Question"
    assert_selector "p", text: "Question was added successfully."
    take_screenshot
  end

  test "can not create question with empty tet" do
    visit page_url
    click_on "Add Question"
    take_screenshot
    assert_selector "div#error_explanation", text: "Text can't be blank"
  end

  test "can edit a question" do
    visit page_url
    @question = @survey.questions.first
    find("li", id: dom_id(@question)).click_link("Edit")
    fill_in "survey_question_text", with: "question 1 new"
    click_on "Edit Question"
    assert_text "Question 1"
    assert_no_text "Save"
    take_screenshot
  end

  test "can not edit a survey with invalid text" do
    visit page_url
    @question = @survey.questions.first
    find("li", id: dom_id(@question)).click_link("Edit")
    within "turbo-frame##{dom_id(@question)}" do
      fill_in "survey_question_text", with: ""
      click_on "Edit Question"
    end
    assert_selector "div#error_explanation", text: "Text can't be blank"
    take_screenshot
  end

  test "can delete a question" do
    visit page_url
    @question = @survey.questions.first
    page.accept_confirm do
      find("li", id: dom_id(@question)).click_link("Delete")
    end
    take_screenshot
    assert_no_text @question.decorate.display_text
  end
end

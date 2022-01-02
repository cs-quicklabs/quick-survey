require "application_system_test_case"

class SurveysTest < ApplicationSystemTestCase
  setup do
    @user = users(:regular)
    @survey = survey_surveys(:user)
    sign_in @user
  end

  def page_url
    surveys_url
  end

  def surveys_page_url
    survey_questions_url(survey_id: @survey.id)
  end

  test "can show index if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: "Select Survey"
    assert_text "Add New Survey"
  end

  test "can not show index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can show survey detail page" do
    visit page_url
    find(id: dom_id(@survey)).click_link("Show")
    within "#survey-header" do
      assert_text "Attempt"
      assert_text "Clone"
    end
    take_screenshot
  end

  test "can create a new survey" do
    visit page_url
    click_on "New Survey"
    fill_in "survey_survey_name", with: "Survey Campaign"
    fill_in "survey_survey_description", with: "This is a sample Survey Description"
    select "Score", from: "survey_survey_survey_type"
    click_on "Add Survey"
    take_screenshot
    assert_text "Survey Campaign"
  end

  test "can not create with empty Name Discription survey_type" do
    visit page_url
    click_on "New Survey"
    assert_selector "h3", text: "Add New Survey"
    click_on "Add Survey"
    take_screenshot
    assert_selector "h3", text: "Add New Survey"
  end

  test "can edit a survey" do
    visit page_url
    find(id: dom_id(@survey)).click_link("Edit")
    assert_selector "h3", text: "Edit Survey"
    fill_in "survey_survey_name", with: "Survey Campaigning"
    click_on "Edit Survey"
    assert_text "Survey Campaigning"
  end

  test "can not edit a survey with invalid name" do
    visit page_url
    find(id: dom_id(@survey)).click_link("Edit")
    assert_selector "h3", text: "Edit Survey"
    fill_in "survey_survey_name", with: ""
    click_on "Edit Survey"
    take_screenshot
  end

  test "can clone a survey" do
    visit page_url
    find(id: dom_id(@survey)).click_link(@survey.name)
    within "#survey-header" do
      page.accept_confirm do
        click_on "Clone"
      end
    end
    take_screenshot
    assert_text "#{@survey.name} (Copy)"
  end

  test "can delete survey" do
    visit page_url
    page.accept_confirm do
      find(id: dom_id(@survey)).click_link("Delete")
    end
    assert_no_text @survey.name
    take_screenshot
  end
end

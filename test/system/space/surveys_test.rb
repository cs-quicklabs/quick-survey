require "application_system_test_case"

class SurveysTest < ApplicationSystemTestCase
  setup do
    @user = users(:member)
    @space = @user.spaces.where(archive: false, user_id: @user.id).first
    @folder = @space.folders.where(user_id: @user.id).first
    @survey = @folder.survey_surveys.where(user_id: @user.id).first
    sign_in @user
  end

  def page_url
    space_folder_url(space_id: @space.id, id: @folder.id)
  end

  def surveys_page_url
    survey_url(@survey)
  end

  test "can show surveys if logged in" do
    visit page_url
    take_screenshot
    assert_selector "h1", text: @folder.title
    assert_text "Add New Survey"
  end

  test "can not show index if not logged in" do
    sign_out @user
    visit page_url
    assert_selector "h1", text: "Sign in to your account"
  end

  test "can show survey detail page" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on "Show"
    end
    within "#survey-header" do
      assert_selector "h1", text: @survey.name
      assert_text "Actions"
    end
    take_screenshot
  end

  test "can create a new survey in folder" do
    visit page_url
    click_on "Add New Survey"
    fill_in "survey_survey_name", with: "Survey Campaign"
    fill_in "survey_survey_description", with: "This is a sample Survey Description"
    select "Score", from: "survey_survey_survey_type"
    click_on "Add Survey"
    take_screenshot
    assert_text @folder.title
    assert_text "Survey Campaign"
  end

  test "can not create with empty Name Discription survey_type" do
    visit page_url
    click_on "Add New Survey"
    assert_selector "h3", text: "Add New Survey"
    click_on "Add Survey"
    take_screenshot
    assert_selector "h3", text: "Add New Survey"
  end

  test "can edit a survey" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on("Edit")
    end
    assert_selector "h3", text: "Edit Survey"
    fill_in "survey_survey_name", with: "Survey Campaigning"
    click_on "Edit Survey"
    assert_text "Survey Campaigning"
  end

  test "can pin a survey" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on "Pin Survey"
    end
    assert_text "Survey has been pinned."
  end

  test "can unpin a survey" do
    pinned = survey_surveys(:four)
    visit page_url
    within "tr##{dom_id(pinned)}" do
      find("button", id: "survey-menu").click
      click_on "Unpin Survey"
    end
    assert_text "Survey has been unpinned."
  end

  test "can not edit a survey with invalid name" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      click_on("Edit")
    end
    assert_selector "h3", text: "Edit Survey"
    fill_in "survey_survey_name", with: ""
    click_on "Edit Survey"
    take_screenshot
  end

  test "can archive a survey" do
    visit page_url
    survey = survey_surveys(:two)
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      page.accept_confirm do
        click_on "Archive"
      end
    end
    assert_text "Survey has been archived."
  end

  test "can change folder" do
    visit page_url
    within "tr##{dom_id(@survey)}" do
      find("button", id: "survey-menu").click
      find("p", id: "change-folder").click
    end
    select @space.title, from: "space_id"
    second_option_text = find("#folder_id").all("option")[1].text
    select second_option_text, from: "folder_id"
    click_on "Change"
    assert_text "Folder was changed successfully."
  end
end
